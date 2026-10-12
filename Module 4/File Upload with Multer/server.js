import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "threadbase_secret";

app.use(cors());
app.use(express.json());

// Demo account: Ada
const users = [{ userId: 1, username: "ada", password: "password" }];

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (candidate) =>
      candidate.username === username && candidate.password === password,
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    JWT_SECRET,
    { expiresIn: "8h" },
  );

  return res.json({
    token,
    user: { userId: user.userId, username: user.username },
  });
});

// Serve uploaded images directly at /uploads/<filename>.
app.use("/uploads", express.static("uploads"));

// Upload route is mounted at /api/upload.
app.use("/api", uploadRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, service: "threadbase-upload-server" }),
);

// Convert upload validation and size errors to HTTP 400 responses.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size must not exceed 5MB." });
  }

  if (error.code === "INVALID_FILE_TYPE" || error.status === 400) {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
