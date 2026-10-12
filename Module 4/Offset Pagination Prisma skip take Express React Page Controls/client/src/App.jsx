import ThreadList from "./components/ThreadList.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <p className="muted">
        The feed returns <strong>every</strong> thread at once. Your job: add
        offset pagination — <code> skip</code>/<code>take </code>on the server, and
        page state with <code> Previous</code>/<code>Next </code>controls in React.
      </p>
      <ThreadList />
    </div>
  );
}
