// components/NavBar.jsx — wired for you.
// Shows the current user (or a Login link) and a Logout button.
// Use it to test your gates: log in as Ada or Linus, then click around.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function NavBar() {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    navigate("/", { replace: true });
  }

  return (
    <nav className="nav">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/threads">Threads</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/threads/new">New thread</Link>
      </div>
      <div className="nav-user">
        {user ? (
          <>
            <span className="who">
              {user.name} <em>({user.role})</em>
            </span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </div>
    </nav>
  );
}
