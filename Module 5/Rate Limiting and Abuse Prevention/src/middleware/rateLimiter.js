'use strict';

const rateLimit = require('express-rate-limit');

const WINDOW_MS = 15 * 60 * 1000;

const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  // Make Retry-After explicit so clients know when retrying is reasonable.
  handler: (req, res) => {
    const resetTime = req.rateLimit && req.rateLimit.resetTime;
    const retryAfterSeconds = resetTime instanceof Date
      ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
      : Math.ceil(WINDOW_MS / 1000);

    res.setHeader('Retry-After', String(retryAfterSeconds));
    return res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many authentication attempts. Please try again later.',
      },
    });
  },
});

// Multi-instance deployments should replace express-rate-limit's default
// in-memory store with a shared Redis store from the rate-limit-redis package,
// configured with a Redis client/command adapter. Each in-memory store tracks
// counters only inside its own Node.js process; behind a load balancer, retries
// may hit different instances with separate counters, letting an attacker exceed
// the intended limit. Redis centralizes the counter and window so all instances
// enforce one shared limit.

module.exports = authLimiter;
