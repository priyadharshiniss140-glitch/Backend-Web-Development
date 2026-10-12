// pages/ProfilePage.jsx — should be protected (task 2).
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <section className="page">
      <h2>Profile</h2>
      {user ? (
        <ul>
          <li>Name: {user.name}</li>
          <li>User ID: {user.userId}</li>
          <li>Role: {user.role}</li>
        </ul>
      ) : (
        <p className="muted">You should not be able to see this while logged out.</p>
      )}
    </section>
  );
}
