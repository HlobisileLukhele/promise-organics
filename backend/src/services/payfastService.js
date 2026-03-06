import crypto from 'crypto';
import { config } from '../config/env.js';

const SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process';
const LIVE_URL    = 'https://www.payfast.co.za/eng/process';

export function getPayfastUrl() {
  return config.payfast.sandbox ? SANDBOX_URL : LIVE_URL;
}

// Mirrors PHP urlencode(): encodes spaces as '+', other special chars as %XX.
function pfEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, '+');
}

/**
 * Build an MD5 signature from an ordered params object.
 * Empty-string / null / undefined values are skipped (consistent with PayFast PHP SDK).
 * @param {Record<string, string>} params  - payload fields (no `signature` key)
 * @param {string} [passphrase]            - account passphrase (appended last if set)
 * @returns {string} hex MD5 digest
 */
export function buildSignature(params, passphrase = '') {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${k}=${pfEncode(v)}`);

  let str = parts.join('&');
  if (passphrase) {
    str += `&passphrase=${pfEncode(passphrase)}`;
  }

  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Verify a signature received in a PayFast ITN callback.
 * @param {Record<string, string>} params           - all ITN fields except `signature`
 * @param {string}                 receivedSignature - the `signature` field from PayFast
 * @param {string}                 [passphrase]
 * @returns {boolean}
 */
export function verifySignature(params, receivedSignature, passphrase = '') {
  const computed = buildSignature(params, passphrase);
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(receivedSignature),
  );
}
