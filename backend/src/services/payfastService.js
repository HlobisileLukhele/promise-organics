import md5 from 'md5';

const SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process';
const LIVE_URL    = 'https://www.payfast.co.za/eng/process';

/**
 * Build an MD5 signature from a payment data object.
 * Keys are sorted alphabetically. Empty / null / undefined values are skipped.
 * @param {Record<string, string>} data
 * @param {string} [passPhrase]
 * @returns {string} uppercase MD5 hex digest
 */
export function generateSignature(data, passPhrase = '') {
  const queryString = Object.keys(data)
    .sort()
    .filter((key) => data[key] !== '' && data[key] !== null && data[key] !== undefined)
    .map((key) => `${key}=${encodeURIComponent(String(data[key])).replace(/%20/g, '+')}`)
    .join('&');

  const str = passPhrase
    ? `${queryString}&passphrase=${encodeURIComponent(passPhrase).replace(/%20/g, '+')}`
    : queryString;

  return md5(str).toUpperCase();
}

/**
 * Build the complete PayFast payment payload for an order.
 * @param {{ id: string, total_amount: number }} order
 * @param {object|null} billingInfo  - user's billing record (reserved, not sent to PayFast)
 * @param {{ full_name: string, email: string }} user
 * @returns {Record<string, string>} payload including signature
 */
export function buildPayfastPayload(order, billingInfo, user) {
  const nameParts = (user.full_name ?? '').trim().split(/\s+/);
  const nameFirst = nameParts[0] || 'Customer';
  const nameLast  = nameParts.slice(1).join(' ') || '';

  const payload = {
    merchant_id:   process.env.PAYFAST_MERCHANT_ID,
    merchant_key:  process.env.PAYFAST_MERCHANT_KEY,
    return_url:    `${process.env.CLIENT_URL}/payment/success`,
    cancel_url:    `${process.env.CLIENT_URL}/payment/cancelled`,
    notify_url:    `${process.env.BACKEND_URL}/api/payment/webhook`,
    name_first:    nameFirst,
    name_last:     nameLast,
    email_address: user.email,
    m_payment_id:  order.id,
    amount:        Number(order.total_amount).toFixed(2),
    item_name:     `Promise Organics Order #${order.id.slice(0, 8)}`,
  };

  // Strip empty/null/undefined fields so PayFast doesn't reject the payload
  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] === undefined || payload[key] === null) {
      delete payload[key];
    }
  });

  const signature = generateSignature(payload, process.env.PAYFAST_PASSPHRASE || '');

  return { ...payload, signature };
}

/**
 * Returns the correct PayFast payment page URL based on PAYFAST_SANDBOX env var.
 * @returns {string}
 */
export function getPayfastUrl() {
  return process.env.PAYFAST_SANDBOX === 'true' ? SANDBOX_URL : LIVE_URL;
}

/**
 * Verify a PayFast ITN webhook signature.
 * Removes the 'signature' field from data, recomputes, and compares.
 * @param {Record<string, string>} data  - all ITN fields including 'signature'
 * @param {string} [passPhrase]
 * @returns {boolean}
 */
export function verifyWebhookSignature(data, passPhrase = '') {
  const { signature, ...params } = data;
  if (!signature) return false;
  const computed = generateSignature(params, passPhrase);
  return computed.toLowerCase() === signature.toLowerCase();
}
