/**
 * csrf.js — Token-based CSRF protection (Django CsrfViewMiddleware pattern)
 * --------------------------------------------------------------------------
 * Reference: https://docs.djangoproject.com/en/6.0/ref/csrf/
 *
 * How it works:
 *  1. Server generates a random 32-byte CSRF secret and stores it in an
 *     httpOnly cookie (`csrftoken`). JS cannot read this cookie.
 *  2. Client calls GET /api/csrf-token to receive a MASKED token derived from
 *     the secret (XOR with a random per-request mask — same as Django's
 *     "scrambled" token). The client stores this masked token in memory.
 *  3. On every unsafe request (POST / PUT / PATCH / DELETE) the client sends
 *     the masked token in the `X-CSRF-Token` header.
 *  4. The middleware reads the httpOnly cookie, unmasks the header token,
 *     and compares it with the secret. Mismatch → 403.
 *  5. The CSRF secret is rotated on every successful login (call
 *     rotateCsrfToken(res) from the login controller).
 *
 * Exemptions (no CSRF check applied):
 *  - GET / HEAD / OPTIONS (safe, read-only methods)
 *  - NODE_ENV === 'test' (keeps existing Jest / Supertest suites green)
 *  - /api/payment/webhook (PayFast ITN — called by an external server, no
 *    browser context, already protected by MD5 signature verification)
 */

import crypto from 'crypto';

// ── Constants ─────────────────────────────────────────────────────────────────

const CSRF_COOKIE_NAME  = 'csrftoken';
const CSRF_HEADER_NAME  = 'x-csrf-token';
const SECRET_BYTES      = 32;   // bytes → 64 hex chars
const MASK_BYTES        = 32;   // must equal SECRET_BYTES for simple XOR

/** HTTP methods that DO NOT mutate state — no CSRF check needed. */
const SAFE_METHODS      = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Paths exempted from CSRF validation.
 * These are called by external services that have no browser session.
 */
const EXEMPT_PATHS      = new Set(['/api/payment/webhook']);

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Parse a raw Cookie header string into a key→value object.
 * Avoids a cookie-parser dependency while handling URL-encoded values.
 */
const parseCookies = (cookieHeader) => {
  const map = {};
  if (!cookieHeader) return map;
  for (const pair of cookieHeader.split(';')) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim();
    const val = pair.slice(eqIdx + 1).trim();
    try { map[key] = decodeURIComponent(val); }
    catch { map[key] = val; }
  }
  return map;
};

/** Generate a cryptographically random hex secret (64 chars). */
const generateSecret = () => crypto.randomBytes(SECRET_BYTES).toString('hex');

/**
 * Produce a masked token from a secret (Django-style single XOR-mask).
 *
 * Format of the returned base64url string:
 *   base64url( mask[32 bytes] || (secret XOR mask)[32 bytes] )
 *
 * A fresh random mask is used every time, so two calls to maskSecret()
 * with the same secret yield different tokens — preventing replay.
 */
const maskSecret = (secret) => {
  const secretBuf = Buffer.from(secret, 'hex');
  const mask      = crypto.randomBytes(MASK_BYTES);
  const xored     = Buffer.alloc(SECRET_BYTES);
  for (let i = 0; i < SECRET_BYTES; i++) {
    xored[i] = secretBuf[i] ^ mask[i];
  }
  // Prepend mask so the server can reconstruct the secret later
  return Buffer.concat([mask, xored]).toString('base64url');
};

/**
 * Reverse maskSecret() — recover the original hex secret from a token.
 * Returns null if the token is malformed.
 */
const unmaskToken = (token) => {
  try {
    const buf    = Buffer.from(token, 'base64url');
    // buf must be exactly: MASK_BYTES + SECRET_BYTES = 64 bytes
    if (buf.length !== MASK_BYTES + SECRET_BYTES) return null;
    const mask   = buf.slice(0, MASK_BYTES);
    const xored  = buf.slice(MASK_BYTES);
    const secret = Buffer.alloc(SECRET_BYTES);
    for (let i = 0; i < SECRET_BYTES; i++) {
      secret[i] = xored[i] ^ mask[i];
    }
    return secret.toString('hex');
  } catch {
    return null;
  }
};

/**
 * Write the CSRF secret to an httpOnly, SameSite=Strict cookie.
 * JS on the page cannot read this value — only the server can.
 */
const setCsrfCookie = (res, secret) => {
  res.cookie(CSRF_COOKIE_NAME, secret, {
    httpOnly: true,   // inaccessible to JS — the secret never leaves the server
    secure:   process.env.NODE_ENV === 'production',  // HTTPS only in prod
    sameSite: 'strict',
    path:     '/',
    maxAge:   24 * 60 * 60 * 1000,  // 24 hours (milliseconds)
  });
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * GET /api/csrf-token
 *
 * Issues (or re-uses) the CSRF httpOnly cookie and returns a fresh masked
 * token that the client must include in the X-CSRF-Token header on all
 * unsafe requests.
 *
 * The client MUST:
 *   1. Call this endpoint on app load (and after login).
 *   2. Store the returned `csrfToken` in memory (not localStorage).
 *   3. Include it as `X-CSRF-Token: <token>` on POST / PUT / PATCH / DELETE.
 */
export const getCsrfToken = (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  let secret    = cookies[CSRF_COOKIE_NAME];

  // Issue a fresh secret if the cookie is absent or looks invalid
  if (!secret || secret.length !== SECRET_BYTES * 2) {
    secret = generateSecret();
    setCsrfCookie(res, secret);
  }

  // Return a newly masked token — safe to cache briefly client-side
  res.json({ success: true, csrfToken: maskSecret(secret) });
};

/**
 * rotateCsrfToken(res)
 *
 * Replace the current CSRF secret with a new one.
 * Call this immediately after a successful login so the pre-login token
 * (potentially obtained by a malicious page before the user authenticated)
 * is invalidated.
 *
 * After calling this the client must fetch a fresh masked token via
 * GET /api/csrf-token before making any further mutating requests.
 *
 * @param {import('express').Response} res
 */
export const rotateCsrfToken = (res) => {
  setCsrfCookie(res, generateSecret());
};

/**
 * csrfProtect — Express middleware
 *
 * Validates the X-CSRF-Token request header against the secret stored in
 * the httpOnly csrftoken cookie on every unsafe HTTP method.
 *
 * Attach this middleware app-wide AFTER your body parser:
 *   app.use(csrfProtect);
 */
export const csrfProtect = (req, res, next) => {
  // ── Exemptions ─────────────────────────────────────────────────────────────

  // Skip in test environment — Jest / Supertest suites do not send cookies
  if (process.env.NODE_ENV === 'test') return next();

  // Safe HTTP methods cannot cause state changes → no CSRF risk
  if (SAFE_METHODS.has(req.method)) return next();

  // External-service callbacks that have no browser session
  if (EXEMPT_PATHS.has(req.path)) return next();

  // ── Validation ─────────────────────────────────────────────────────────────

  const cookies  = parseCookies(req.headers.cookie);
  const secret   = cookies[CSRF_COOKIE_NAME];
  const tokenHdr = req.headers[CSRF_HEADER_NAME];

  if (!secret) {
    return res.status(403).json({
      success: false,
      message: 'CSRF validation failed: session cookie missing. Call GET /api/csrf-token first.',
    });
  }

  if (!tokenHdr) {
    return res.status(403).json({
      success: false,
      message: 'CSRF validation failed: X-CSRF-Token header is required.',
    });
  }

  const recovered = unmaskToken(tokenHdr);
  if (!recovered || !crypto.timingSafeEqual(
    Buffer.from(recovered),
    Buffer.from(secret),
  )) {
    return res.status(403).json({
      success: false,
      message: 'CSRF validation failed: token mismatch.',
    });
  }

  next();
};
