'use strict';

const crypto = require('node:crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

async function handleWebhook(req, res) {
  const signatureHeader = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  // The signature is calculated over the original raw Buffer, never parsed JSON.
  if (
    typeof signatureHeader !== 'string' ||
    !signatureHeader.startsWith('sha256=') ||
    !secret ||
    !Buffer.isBuffer(req.body)
  ) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const receivedHex = signatureHeader.slice('sha256='.length);
  // SHA-256 digests are exactly 32 bytes (64 hexadecimal characters).
  if (!/^[0-9a-fA-F]{64}$/.test(receivedHex)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const expectedHex = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');

  const expectedSignature = Buffer.from(expectedHex, 'hex');
  const receivedSignature = Buffer.from(receivedHex, 'hex');

  if (
    expectedSignature.length !== receivedSignature.length ||
    !crypto.timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (!event || typeof event.id !== 'string' || event.id.length === 0) {
    return res.status(400).json({ error: 'Event id is required' });
  }

  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // Mark before acknowledgement/processing to make concurrent replays idempotent.
  _processedIds.add(event.id);

  res.status(200).json({ status: 'received' });

  // Processing is deliberately deferred until after the response is sent.
  setImmediate(() => {
    Promise.resolve(handleEvent(event)).catch((error) => {
      console.error(`Webhook event ${event.id} processing failed:`, error);
    });
  });
}

module.exports = { handleWebhook, _processedIds };
