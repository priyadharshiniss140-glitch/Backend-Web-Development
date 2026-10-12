import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 600, margin: "3rem auto", textAlign: "center" }}>
      <h1>Welcome to Threadbase</h1>
      {user ? (
        <p>Logged in as <strong>{user.name}</strong>. <Link to="/threads">View threads</Link></p>
      ) : (
        <p><Link to="/login">Log in</Link> to get started.</p>
      )}
      <hr style={{ margin: "2rem 0", borderColor: "#e5e7eb" }} />
      <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
        Assignment: implement <code>useSSE</code> and wire it in <code>AppShell</code>
        so the bell badge increments when the server pushes a notification.
      </p>
    </div>
  );
}
