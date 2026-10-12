import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "threadbase_secret";

// Verifies the Bearer token and attaches req.user.
export function verifyToken(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
