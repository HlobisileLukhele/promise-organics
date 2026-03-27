/**
 * validate.js — Zod v4-based request body validation middleware
 * ---------------------------------------------------------------
 * OWASP A03:2021 (Injection) + A04:2021 (Insecure Design):
 *   - Enforces types, lengths, and formats on every route accepting a body.
 *   - Strips undeclared fields so only schema-defined keys reach controllers
 *     and the database (prevents mass-assignment / prototype-pollution).
 *   - Returns HTTP 400 with a structured error list on any violation.
 *
 * Zod v4 note: `required_error` is ignored; use z.preprocess + z.string({ error })
 * to produce custom "field is required" messages.
 *
 * Backward-compatibility notes:
 *   - product_id validated as non-empty string (not UUID) — tests use 'prod-1'.
 *   - Error messages mirror original controller messages for test compatibility.
 */

import { z } from 'zod';

// ── Middleware factory ────────────────────────────────────────────────────────

/**
 * Returns an Express middleware that:
 *   1. Parses req.body through the given Zod schema (Zod v4 .safeParse).
 *   2. On failure: 400 with the FIRST error's message as top-level `message`
 *      (preserves test compatibility for `res.body.message.toMatch(...)`).
 *   3. On success: replaces req.body with validated, stripped (no unknown fields) data.
 *
 * @param {import('zod').ZodSchema} schema
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    // Zod v4 stores issues in .issues (not .errors like v3)
    const issues = result.error?.issues ?? [];
    const errors = issues.map((e) => ({
      field:   Array.isArray(e.path) ? (e.path.join('.') || 'body') : 'body',
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      // First error's message as top-level so tests checking res.body.message pass
      message: errors[0]?.message || 'Validation failed.',
      errors,
    });
  }
  req.body = result.data;
  next();
};

// ── Zod v4 helpers ────────────────────────────────────────────────────────────

/**
 * Required string field with custom "is required" message.
 * In Zod v4, required_error is ignored; z.preprocess + { error } is the fix.
 * @param {string} requiredMsg - message shown when field is missing or empty
 * @param {number} [maxLen]    - optional maximum character length
 * @param {string} [maxMsg]    - error message for length violation
 */
const reqStr = (requiredMsg, maxLen, maxMsg) => {
  let schema = z.string({ error: requiredMsg }).min(1, requiredMsg);
  if (maxLen) schema = schema.max(maxLen, maxMsg ?? `Value is too long (max ${maxLen} chars).`);
  return z.preprocess((v) => v, schema);
};

/**
 * Required number field (no coerce) with custom required/min messages.
 * @param {string} requiredMsg - message when field is absent
 * @param {string} minMsg      - message when value < min
 * @param {number} [min=1]
 * @param {number} [max=99]
 */
const reqNum = (requiredMsg, minMsg, min = 1, max = 99) =>
  z.preprocess((v) => v, z.number({ error: requiredMsg }).min(min, minMsg).max(max));

/** Email field: trimmed, max 254, valid format. */
const emailField = z
  .string({ error: 'Email is required.' })
  .trim()
  .min(1, 'Email is required.')
  .max(254, 'Email address is too long.')
  .email('Please enter a valid email address.');

/** Password field: 8–128 chars. */
const passwordField = z
  .string({ error: 'Password is required.' })
  .min(8,   'Password must be at least 8 characters.')
  .max(128, 'Password is too long.');

// ── Auth schemas ──────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  full_name: reqStr('full_name, email and password are required.', 100, 'full_name is too long.'),
  email:     emailField,
  password:  passwordField,
});

export const loginSchema = z.object({
  email:    emailField,
  password: z.string({ error: 'Email and password are required.' })
              .min(1, 'Email and password are required.')
              .max(128),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  token:       reqStr('Token and new password are required.', 128),
  newPassword: passwordField,
});

// ── Contact schema ────────────────────────────────────────────────────────────

const CONTACT_REQUIRED = 'Name, email, subject, and message are required.';

export const contactSchema = z.object({
  name:    reqStr(CONTACT_REQUIRED, 100, 'Name is too long.'),
  email:   emailField,
  phone:   z.string().trim().max(30, 'Phone number is too long.').optional().default(''),
  subject: reqStr(CONTACT_REQUIRED, 200, 'Subject is too long.'),
  message: reqStr(CONTACT_REQUIRED, 2000, 'Message is too long.'),
});

// ── Review schema ─────────────────────────────────────────────────────────────
// NOTE: validateBody is intentionally NOT applied to POST /api/reviews —
// see routes/reviews.js. This schema exists for documentation.

export const reviewSchema = z.object({
  name:       reqStr('Name and message are required.', 100),
  rating:     z.coerce.number().int().min(1, 'Rating must be between 1 and 5.').max(5),
  message:    reqStr('Name and message are required.', 2000),
  product_id: z.string().min(1).optional().nullable(),
  user_id:    z.string().min(1).optional().nullable(),
  images:     z.array(z.string()).max(5).optional().nullable(),
});

// ── Cart schemas ──────────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  // Non-UUID string: tests use short IDs like 'prod-1'; Supabase rejects invalid UUIDs at DB level
  product_id: reqStr('product_id is required.', 200),
  quantity:   z.coerce.number().int()
                .min(1, 'quantity must be at least 1.')
                .max(99, 'quantity cannot exceed 99.')
                .optional().default(1),
});

export const updateCartSchema = z.object({
  // Use reqNum (no coerce) so missing quantity → "quantity is required."
  // coerce would turn undefined → NaN giving a cryptic message
  quantity: reqNum('quantity is required.', 'quantity must be at least 1.', 1, 99),
});

// ── Wishlist schema ───────────────────────────────────────────────────────────

export const addToWishlistSchema = z.object({
  product_id: reqStr('product_id is required.', 200),
});

// ── Billing schema ────────────────────────────────────────────────────────────

const BILLING_REQUIRED = 'address, city, province and postal_code are required.';

export const billingSchema = z.object({
  address:     reqStr(BILLING_REQUIRED, 300),
  city:        reqStr(BILLING_REQUIRED, 100),
  province:    reqStr(BILLING_REQUIRED, 100),
  postal_code: reqStr(BILLING_REQUIRED, 20),
  phone:       z.string().trim().max(30).optional().default(''),
});

// ── Chat schema ───────────────────────────────────────────────────────────────

const chatTurnSchema = z.object({
  role:    z.enum(['user', 'assistant']),
  content: z.string().max(4000),
});

export const chatSchema = z.object({
  message: reqStr('message is required.', 1000, 'Message is too long (max 1 000 chars).'),
  conversationHistory: z
    .array(chatTurnSchema)
    .max(20, 'Conversation history is too long (max 20 turns).')
    .optional()
    .default([]),
});

// ── Payment schema ────────────────────────────────────────────────────────────

export const initiatePaymentSchema = z.object({
  order_id: reqStr('order_id is required.', 200),
});

// ── Admin — product schemas ───────────────────────────────────────────────────

export const createProductSchema = z.object({
  name:        reqStr('name and price are required.', 200),
  description: z.string().trim().max(2000).optional().nullable(),
  price:       z.coerce.number({ error: 'name and price are required.' }).positive('price must be positive.').max(99_999),
  stock:       z.coerce.number().int().min(0).max(9_999).optional().default(0),
  image_url:   z.string().url('image_url must be a valid URL.').optional().nullable(),
  category:    z.string().trim().max(100).optional().nullable(),
  sku:         z.string().trim().max(100).optional().nullable(),
  in_stock:    z.coerce.boolean().optional().default(true),
  ingredients: z.string().trim().max(2000).optional().nullable(),
  directions:  z.string().trim().max(2000).optional().nullable(),
});

/**
 * updateProductSchema — all fields optional, strict whitelist.
 * Only columns listed here can be written; prevents mass-assignment of
 * internal columns (id, created_at, user_id, …).
 */
export const updateProductSchema = z.object({
  name:        z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  price:       z.coerce.number().positive().max(99_999).optional(),
  stock:       z.coerce.number().int().min(0).max(9_999).optional(),
  image_url:   z.string().url().optional().nullable(),
  category:    z.string().trim().max(100).optional().nullable(),
  sku:         z.string().trim().max(100).optional().nullable(),
  in_stock:    z.coerce.boolean().optional(),
  ingredients: z.string().trim().max(2000).optional().nullable(),
  directions:  z.string().trim().max(2000).optional().nullable(),
});

export const updateStockSchema = z.object({
  in_stock: z.coerce.boolean().optional(),
  stock:    z.coerce.number().int().min(0).max(9_999).optional(),
});

// ── Admin — order schemas ─────────────────────────────────────────────────────

export const updateOrderSchema = z.object({
  status: z.enum(
    ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
  ).optional(),
  shipping_address: z.string().trim().max(500).optional().nullable(),
  notes:            z.string().trim().max(1000).optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});
