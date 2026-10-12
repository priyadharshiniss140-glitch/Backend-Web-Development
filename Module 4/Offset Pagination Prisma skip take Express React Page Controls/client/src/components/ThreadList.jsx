import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

const PAGE_SIZE = 10;

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p className="muted">Loading threads…</p>;
  if (isError) return <p className="error">Could not load threads: {error.message}</p>;

  const threads = data.threads ?? [];
  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <>
      {threads.length === 0 ? (
        <p className="muted">No threads found.</p>
      ) : (
        <ul className="threads">
          {threads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))}
        </ul>
      )}

      <div className="pager" aria-label="Thread pagination">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
        >
          Previous
        </button>
        <span className="page-label">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={!data.hasMore}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
