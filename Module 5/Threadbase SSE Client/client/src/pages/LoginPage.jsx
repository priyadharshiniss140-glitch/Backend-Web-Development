import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/threads");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "4rem auto", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Log in to Threadbase</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 8 }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          style={{ padding: "0.6rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 8 }}
        />
        {error && <p style={{ color: "#ef4444", margin: 0, fontSize: "0.875rem" }}>{error}</p>}
        <button
          type="submit" disabled={loading}
          style={{ padding: "0.65rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p style={{ marginTop: "1.25rem", fontSize: "0.85rem", color: "#6b7280" }}>
        Demo: <strong>ada@threadbase.dev</strong> / password
      </p>
    </div>
  );
}
