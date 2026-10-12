import { useEffect, useState } from "react";
import { getThreads, createThread } from "./services/threads.service";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

export default function App() {
  const [threads, setThreads] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const data = await getThreads();
      setThreads(data);
      setStatus("ready");
    } catch (e) {
      setError(String(e?.message || e));
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createThread({ title, body });
      setTitle("");
      setBody("");
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        API base URL: <code>{String(import.meta.env.VITE_API_URL)}</code> (open the console too)
      </p>
      {status === "error" && <p className="err">Error: {error}</p>}
      {status === "ready" && (
        <>
          <form onSubmit={onSubmit}>
            <input
              placeholder="Thread title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Thread body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add thread"}
            </button>
            {error && <span className="err">{error}</span>}
          </form>
          {threads.map((t) => (
            <div className="card" key={t.id}>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
