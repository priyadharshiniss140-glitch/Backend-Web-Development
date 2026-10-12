'use strict';

const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true,
  // Avoid unhandled retry storm when Redis is unavailable; cache helpers fail open.
  retryStrategy: (times) => Math.min(times * 100, 1000),
  maxRetriesPerRequest: 1,
});

async function cacheGet(key) {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    const value = await redis.get(key);
    return value === null ? null : JSON.parse(value);
  } catch (error) {
    console.error('[cache] get error:', error.message);
    return null;
  }
}

async function cacheSet(key, data, ttlSeconds) {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (error) {
    console.error('[cache] set error:', error.message);
  }
}

async function cacheDel(key) {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }
    await redis.del(key);
  } catch (error) {
    console.error('[cache] del error:', error.message);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel, redis };
