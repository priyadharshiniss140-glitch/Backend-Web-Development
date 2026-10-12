import apiClient from "./apiClient";

// Fetches one page of threads. `cursor` is the id of the last thread from
// the previous page (undefined for the first page). Returns { threads, nextCursor }.
export async function getThreads({ cursor, take = 10 }) {
  const res = await apiClient.get("/api/threads", {
    params: { cursor, take },
  });
  return res.data; // { threads, nextCursor }
}
