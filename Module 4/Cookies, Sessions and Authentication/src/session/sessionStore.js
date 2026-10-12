const { randomBytes } = require("node:crypto");
const { SESSION_TTL_MS } = require("../config/cookieConfig");

// Learning/local-only store. Use Redis or another shared expiring store in production.
const sessions = new Map();

function removeExpiredSessions(now = Date.now()) {
  for (const [sessionId, session] of sessions) {
    if (session.expiresAt <= now) {
      sessions.delete(sessionId);
    }
  }
}

function create(userId) {
  const now = Date.now();
  removeExpiredSessions(now);

  let sessionId;
  do {
    sessionId = randomBytes(32).toString("hex");
  } while (sessions.has(sessionId));

  const expiresAt = now + SESSION_TTL_MS;
  sessions.set(sessionId, { userId, expiresAt });

  return { sessionId, expiresAt };
}

function get(sessionId) {
  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return null;
  }

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return { userId: session.userId, expiresAt: session.expiresAt };
}

function destroy(sessionId) {
  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return false;
  }
  return sessions.delete(sessionId);
}

module.exports = { create, get, destroy };
