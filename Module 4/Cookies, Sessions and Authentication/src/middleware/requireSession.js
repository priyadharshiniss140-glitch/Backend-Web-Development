const authService = require("../services/authService");
const { COOKIE_NAME } = require("../config/cookieConfig");

const UNAUTHENTICATED = {
  error: {
    code: "UNAUTHENTICATED",
    message: "Authentication required",
  },
};

module.exports = async function requireSession(req, res, next) {
  // cookie-parser sets a signed cookie to false when its signature is invalid.
  const sessionId = req.signedCookies?.[COOKIE_NAME];
  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return res.status(401).json(UNAUTHENTICATED);
  }

  try {
    const user = await authService.resolveSession(sessionId);
    if (!user) {
      return res.status(401).json(UNAUTHENTICATED);
    }

    req.user = user;
    req.sessionId = sessionId;
    return next();
  } catch (error) {
    return next(error);
  }
};
