/**
 * sanitize.js — Security utility helpers
 * ----------------------------------------
 * Addresses OWASP A03:2021 (Injection) — specifically:
 *   - Email Header Injection: CRLF characters in user-supplied strings that
 *     land in email To/From/Subject/Cc headers.
 *   - XSS in HTML email bodies: user data rendered unescaped inside <html>.
 *   - Basic email address format validation.
 */

// ── HTML escaping ─────────────────────────────────────────────────────────────

const HTML_ESCAPE_MAP = {
  '&':  '&amp;',
  '<':  '&lt;',
  '>':  '&gt;',
  '"':  '&quot;',
  "'":  '&#x27;',
  '/':  '&#x2F;',
};

/**
 * Escape HTML special characters to prevent XSS when user-supplied data
 * is interpolated into an HTML email body (or any HTML string).
 *
 * Usage: always call this on name, email, subject, message, status, etc.
 * before inserting them into template literals that produce HTML.
 *
 * @param {unknown} value - raw user input
 * @returns {string} HTML-safe string (empty string for non-string input)
 */
export const escapeHtml = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char]);
};

// ── Email header injection prevention ────────────────────────────────────────

/**
 * Strip carriage returns (\r), newlines (\n), and null bytes (\0) from any
 * string that will be used in an email header field (To, From, Subject, Cc, …).
 *
 * An attacker who can inject "\r\nBcc: attacker@evil.com" into a subject field
 * can hijack the email and send spam through your SMTP server.
 *
 * @param {unknown} value - raw user input intended for a header field
 * @returns {string} sanitised string safe for SMTP headers
 */
export const stripHeaderChars = (value) => {
  if (typeof value !== 'string') return '';
  // Remove CRLF sequences, standalone CR/LF, and null bytes
  return value.replace(/[\r\n\0]/g, '');
};

// ── Email format validation ───────────────────────────────────────────────────

/**
 * RFC 5321-aligned email address format check.
 * This is a lightweight guard — Zod's z.string().email() is the primary
 * schema-level check; this helper is for ad-hoc usage inside controllers.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export const validateEmailFormat = (value) => {
  if (typeof value !== 'string') return false;
  if (value.length > 254) return false;        // RFC 5321 max length
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};
