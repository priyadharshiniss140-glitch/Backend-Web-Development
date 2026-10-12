const express = require("express");
const authService = require("../services/authService");
const requireSession = require("../middleware/requireSession");
const { COOKIE_NAME, COOKIE_OPTIONS } = require("../config/cookieConfig");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { sessionId, user } = await authService.login(req.body);
    res.cookie(COOKIE_NAME, sessionId, COOKIE_OPTIONS);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireSession, (req, res) => {
  return res.status(200).json(req.user);
});

router.post("/logout", async (req, res, next) => {
  try {
    const signedSessionId = req.signedCookies?.[COOKIE_NAME];
    const sessionId =
      typeof signedSessionId === "string" && signedSessionId.length > 0
        ? signedSessionId
        : null;

    await authService.logout(sessionId);
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
