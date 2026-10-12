'use strict';

const crypto = require('node:crypto');

const store = new Map();
const verifiedEmails = new Set();

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

function generateOTP() {
  // crypto.randomInt uses an exclusive upper bound, so this yields 100000–999999.
  return String(crypto.randomInt(100000, 1000000));
}

function storeOTP(email, otp) {
  store.set(email, {
    otp: String(otp),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

function verifyOTP(email, code) {
  const entry = store.get(email);

  // Check order is intentional: not found, expired, attempt limit, code match.
  if (!entry) {
    return { ok: false, reason: 'not_found' };
  }

  if (Date.now() >= entry.expiresAt) {
    store.delete(email);
    return { ok: false, reason: 'expired' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (String(code) !== entry.otp) {
    entry.attempts += 1;
    return { ok: false, reason: 'wrong_code' };
  }

  // OTPs are single-use.
  store.delete(email);
  return { ok: true };
}

function markVerified(email) {
  verifiedEmails.add(email);
  console.log(`Email verified: ${email}`);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: store,
};
