// pages/DashboardPage.jsx — should be protected (task 2).
// It already uses <RoleGate> to wrap an admin-only section (task 3):
// once RoleGate works, only admins (Linus) see the "Admin tools" block.
import RoleGate from "../components/RoleGate.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="page">
      <h2>Dashboard</h2>
      <p className="muted">Welcome{user ? `, ${user.name}` : ""}. This page should require login.</p>

      <RoleGate requiredRole="admin">
        <div className="admin">
          <h3>Admin tools</h3>
          <p>Only admins should ever see this section.</p>
          <button className="danger">Delete site</button>
        </div>
      </RoleGate>
    </section>
  );
}
