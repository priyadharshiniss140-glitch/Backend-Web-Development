// pages/ThreadsPage.jsx — public list. No changes needed here;
// the per-thread Edit/Delete logic lives in ThreadItem.jsx (task 4).
import { THREADS } from "../data/threads.js";
import ThreadItem from "../components/ThreadItem.jsx";

export default function ThreadsPage() {
  return (
    <section className="page">
      <h2>Threads</h2>
      {THREADS.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </section>
  );
}
