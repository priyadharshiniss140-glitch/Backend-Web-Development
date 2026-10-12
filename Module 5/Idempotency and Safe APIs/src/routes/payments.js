'use strict';
// routes/payments.js — idempotent payment creation.

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  // Without a caller-supplied key, a retry cannot be distinguished from a new
  // payment attempt. Reject it before creating any charge.
  const headerKey = req.headers['idempotency-key'];
  if (typeof headerKey !== 'string' || headerKey.trim().length === 0) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required',
      },
    });
  }

  const key = headerKey.trim();

  // A retry must get the exact status and body from the first request.
  const cachedResponse = idempotency.get(key);
  if (cachedResponse) {
    return res.status(cachedResponse.status).json(cachedResponse.body);
  }

  // This key has not been processed: create and record one real charge.
  const amount = req.body && req.body.amount;
  const charge = { id: nextChargeId(), amount, status: 'charged' };
  charges.push(charge);

  const status = 201;
  const body = {
    id: charge.id,
    amount: charge.amount,
    status: charge.status,
  };

  idempotency.set(key, { status, body });
  return res.status(status).json(body);
});

module.exports = router;
