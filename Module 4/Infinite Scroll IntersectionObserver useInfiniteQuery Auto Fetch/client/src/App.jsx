import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        Cursor pagination is already wired with <code>useInfiniteQuery</code> and a
        <code> Load More </code> button. Your job: replace the button with{" "}
        <strong>automatic infinite scroll</strong> — a <code>useIntersection</code> hook
        watching a sentinel <code>div</code> that calls <code>fetchNextPage</code> as you
        scroll.
      </p>
      <ThreadList />
    </div>
  );
}
