// ────────────────────────────────────────────────────────────
// Auth scaffold — DO NOT EDIT.
// It exists only so your React app has a real /auth/login to call.
// It signs a short-lived access token and returns the user object
// (including their role) that AuthContext stores.
// ────────────────────────────────────────────────────────────
import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// Two demo accounts. Password for both is "password".
// Ada is a normal member; Linus is an admin.
const USERS = [
  { userId: 1, name: "Ada", email: "ada@threadbase.dev", password: "password", role: "member" },
  { userId: 2, name: "Linus", email: "linus@threadbase.dev", password: "password", role: "admin" },
];

// POST /auth/login  →  { accessToken, user }
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const found = USERS.find((u) => u.email === email && u.password === password);
  if (!found) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const accessToken = jwt.sign(
    { userId: found.userId, role: found.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  // Never send the password back. The user object carries the role that
  // RoleGate and the ownership check read on the client.
  res.json({
    accessToken,
    user: { userId: found.userId, name: found.name, role: found.role },
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Auth scaffold on http://localhost:${PORT}`));
