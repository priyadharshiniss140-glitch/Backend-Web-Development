// pages/NewThreadPage.jsx — should be protected (task 2).
export default function NewThreadPage() {
  return (
    <section className="page">
      <h2>New thread</h2>
      <p className="muted">A logged-out visitor should be redirected to /login before reaching this form.</p>
      <form className="login" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Title" />
        <textarea placeholder="What's on your mind?" rows={4} />
        <button type="submit">Post</button>
      </form>
    </section>
  );
}
