import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        Threadbase uses cursor-based <code>useInfiniteQuery</code> pagination.
        Scroll through the feed and the next page loads automatically when the
        sentinel approaches the viewport.
      </p>
      <ThreadList />
    </div>
  );
}
