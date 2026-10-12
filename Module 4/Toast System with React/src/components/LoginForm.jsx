import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext.jsx";
import { login } from "../api/mockApi.js";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      showToast("Welcome back!", "success");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      showToast(message, "error");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({ username, password });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <p className="hint">
        Correct login: <code>ada</code> / <code>password</code>. Anything else triggers an
        error toast.
      </p>
      <input
        className="input"
        placeholder="Username"
        aria-label="Username"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button className="btn" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
