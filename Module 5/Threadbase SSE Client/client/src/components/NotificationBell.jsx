import { useNotifications } from "../context/NotificationContext.jsx";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <button
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
    >
      {/* Bell icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>

      {/* Badge — only shown when unreadCount > 0 */}
      {unreadCount > 0 && (
        <span style={{
          position: "absolute",
          top: "-2px",
          right: "-2px",
          background: "#ef4444",
          color: "#fff",
          borderRadius: "999px",
          fontSize: "0.65rem",
          fontWeight: 700,
          minWidth: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 3px",
        }}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
