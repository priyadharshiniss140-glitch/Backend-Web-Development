require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const HttpError = require("./errors/HttpError");

const cookieSecret = process.env.COOKIE_SECRET;
if (typeof cookieSecret !== "string" || cookieSecret.length < 32) {
  throw new Error("COOKIE_SECRET must be configured with at least 32 characters.");
}

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(cookieParser(cookieSecret));
app.use("/auth", authRoutes);

// Do not log or send raw Prisma, bcrypt, signing, or session-store errors.
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  if (error && (error.type === "entity.parse.failed" || error.status === 400)) {
    return res.status(400).json({
      error: {
        code: "INVALID_INPUT",
        message: "Request body must be valid JSON",
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API listening on ${port}`));
