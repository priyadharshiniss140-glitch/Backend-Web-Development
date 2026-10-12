import CreateThreadForm from "./components/CreateThreadForm.jsx";
import LoginForm from "./components/LoginForm.jsx";

export default function App() {
  return (
    <main className="page">
      <h1>Threadbase</h1>
      <p className="lead">
        Submit either form to see a toast notification in the top-right corner.
        Toasts stack, dismiss automatically, and can be clicked to close early.
      </p>
      <div className="grid">
        <CreateThreadForm />
        <LoginForm />
      </div>
    </main>
  );
}
