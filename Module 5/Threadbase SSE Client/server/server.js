// ─────────────────────────────────────────────────────────────
// Threadbase SSE Server — DO NOT EDIT.
// Provides:
//   POST /auth/login                 → { accessToken, user }
//   GET  /api/notifications/stream   → SSE stream (requires JWT)
//   POST /api/notifications/test     → pushes a test event to the caller (requires JWT)
// ─────────────────────────────────────────────────────────────
import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ── Demo users ────────────────────────────────────────────────
const USERS = [
  { userId: 1, name: "Ada",   email: "ada@threadbase.dev",   password: "password" },
  { userId: 2, name: "Linus", email: "linus@threadbase.dev", password: "password" },
];

// ── JWT middleware ────────────────────────────────────────────
function verifyToken(req, res, next) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ── Client registry ───────────────────────────────────────────
// Maps userId → open SSE response object.
const clients = new Map();

function notifyUser(userId, payload) {
  const res = clients.get(userId);
  if (res) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }
}

// ── Routes ────────────────────────────────────────────────────

// POST /auth/login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const found = USERS.find((u) => u.email === email && u.password === password);
  if (!found) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = jwt.sign(
    { userId: found.userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  res.json({
    accessToken,
    user: { userId: found.userId, name: found.name },
  });
});

// GET /api/notifications/stream   — SSE endpoint
app.get("/api/notifications/stream", verifyToken, (req, res) => {
  // The four headers that open a stream
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // send headers now or the stream never opens

  const { userId } = req.user;
  clients.set(userId, res);
  console.log(`[SSE] user ${userId} connected. Total clients: ${clients.size}`);

  // Send an initial connected event so the client knows the stream is open
  res.write(`data: ${JSON.stringify({ type: "connected", userId })}\n\n`);

  // Clean up when the client disconnects
  req.on("close", () => {
    clients.delete(userId);
    console.log(`[SSE] user ${userId} disconnected. Total clients: ${clients.size}`);
  });
});

// POST /api/notifications/test   — trigger a test notification to yourself
app.post("/api/notifications/test", verifyToken, (req, res) => {
  const { userId } = req.user;
  const payload = {
    id: `notif_${Date.now()}`,
    type: "test",
    message: "Test notification from the server!",
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  notifyUser(userId, payload);
  res.json({ sent: true, to: userId, payload });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`\n✅  SSE server running on http://localhost:${PORT}`);
  console.log(`   POST /auth/login`);
  console.log(`   GET  /api/notifications/stream  (requires Bearer token)`);
  console.log(`   POST /api/notifications/test    (requires Bearer token)\n`);
});
