import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ThreadsPage from "./pages/ThreadsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NewThreadPage from "./pages/NewThreadPage.jsx";

export default function App() {
  return (
    <div className="wrap">
      <h1>Threadbase</h1>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/threads" element={<ThreadsPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><DashboardPage /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><ProfilePage /></PrivateRoute>}
        />
        <Route
          path="/threads/new"
          element={<PrivateRoute><NewThreadPage /></PrivateRoute>}
        />
      </Routes>
    </div>
  );
}
