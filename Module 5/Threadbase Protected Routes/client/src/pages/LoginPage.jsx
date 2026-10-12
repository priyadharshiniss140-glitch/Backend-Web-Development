// pages/LoginPage.jsx — wired for you (working login).
// On success it dispatches LOGIN and returns the user to wherever they were
// headed before being redirected (location.state.from), or /dashboard.
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../services/apiClient.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const loginMutation = useMutation({
    mutationFn: (credentials) =>
      apiClient.post("/auth/login", credentials).then((res) => res.data),
    onSuccess: (data) => {
      dispatch({ type: "LOGIN", payload: { user: data.user, accessToken: data.accessToken } });
      navigate(from, { replace: true });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <p className="muted">Try ada@threadbase.dev (member) or linus@threadbase.dev (admin) — password is "password".</p>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="ada@threadbase.dev" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" required />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in…" : "Log in"}
      </button>
      {loginMutation.isError && <p className="error">Login failed. Check the credentials.</p>}
    </form>
  );
}
