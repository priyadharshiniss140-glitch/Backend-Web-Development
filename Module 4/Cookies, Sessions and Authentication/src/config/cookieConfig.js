const configuredTtl = Number(process.env.SESSION_TTL_MS);
const SESSION_TTL_MS =
  Number.isSafeInteger(configuredTtl) && configuredTtl > 0
    ? configuredTtl
    : 60 * 60 * 1000;

const COOKIE_NAME = "sid";

// Never permit an insecure cookie in production, even if an env value is misconfigured.
// For local HTTP testing, COOKIE_SECURE=false keeps the cookie usable on localhost.
const secure =
  process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true";

const COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  sameSite: "lax",
  secure,
  path: "/",
  maxAge: SESSION_TTL_MS,
  signed: true,
});

module.exports = {
  COOKIE_NAME,
  COOKIE_OPTIONS,
  SESSION_TTL_MS,
};
