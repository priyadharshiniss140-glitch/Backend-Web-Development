import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext.jsx";
import { createThread } from "../api/mockApi.js";

export default function CreateThreadForm() {
  const [title, setTitle] = useState("");
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: createThread,
    onSuccess: () => {
      showToast("Thread posted!", "success");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Unable to post thread. Please try again.";
      showToast(message, "error");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    mutation.mutate({ title });
    setTitle("");
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Create a thread</h2>
      <p className="hint">
        Tip: the title <code>Welcome to Threadbase</code> already exists, so posting it
        triggers a duplicate-title error.
      </p>
      <input
        className="input"
        placeholder="Thread title"
        aria-label="Thread title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button className="btn" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Posting..." : "Post thread"}
      </button>
    </form>
  );
}
