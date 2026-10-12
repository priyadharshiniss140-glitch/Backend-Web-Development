import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.75rem 1.5rem",
      borderBottom: "1px solid #e5e7eb",
      background: "#fff",
    }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", color: "#1a1a2e" }}>
        Threadbase
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/threads" style={{ color: "#374151", textDecoration: "none" }}>Threads</Link>

        {user ? (
          <>
            <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>Hi, {user.name}</span>
            {/* NotificationBell reads unreadCount from NotificationContext */}
            <NotificationBell />
            <button
              onClick={logout}
              style={{ padding: "0.35rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", background: "#fff" }}
            >
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>Log in</Link>
        )}
      </div>
    </nav>
  );
}
