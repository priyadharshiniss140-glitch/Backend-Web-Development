require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const AppError = require("./errors/AppError");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

// Keep malformed JSON and unexpected server errors on controlled responses.
// Never log raw errors: database/client exceptions may contain sensitive details.
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof AppError) {
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
