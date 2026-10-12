// ThreadsPage — shows a static list of demo threads.
// In a real app these would come from the database.
const DEMO_THREADS = [
  { id: 1, title: "How does SSE differ from WebSockets?", author: "Ada", replies: 4 },
  { id: 2, title: "Best practices for JWT refresh tokens", author: "Linus", replies: 2 },
  { id: 3, title: "Why does React.StrictMode mount components twice?", author: "Ada", replies: 7 },
];

export default function ThreadsPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>Threads</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {DEMO_THREADS.map((t) => (
          <li key={t.id} style={{ padding: "1rem 1.25rem", border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff" }}>
            <strong style={{ fontSize: "1rem" }}>{t.title}</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
              by {t.author} &middot; {t.replies} {t.replies === 1 ? "reply" : "replies"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
