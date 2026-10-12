import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ThreadsPage from "./pages/ThreadsPage.jsx";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
      </Routes>
    </AppShell>
  );
}
