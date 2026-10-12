// pages/HomePage.jsx — public. No changes needed.
export default function HomePage() {
  return (
    <section className="page">
      <h2>Home</h2>
      <p className="muted">
        This page is public. Dashboard, Profile and New thread should require login —
        that's your job. Threads is public, but its Edit/Delete controls should only
        appear on threads you wrote (or if you're an admin).
      </p>
    </section>
  );
}
