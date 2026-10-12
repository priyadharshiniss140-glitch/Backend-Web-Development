import PropTypes from "prop-types";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.svg";
const FALLBACK_AUTHOR = "Anonymous";

export default function ThreadItem({ thread }) {
  const authorName = thread.author?.name || FALLBACK_AUTHOR;
  const avatarUrl = thread.author?.avatarUrl || PLACEHOLDER_AVATAR;
  const commentCount = thread._count?.comments ?? 0;
  const hasAuthor = Boolean(thread.author);

  function handleAvatarError(event) {
    // Avoid an image-error loop if even the placeholder cannot be loaded.
    event.currentTarget.onerror = null;
    event.currentTarget.src = PLACEHOLDER_AVATAR;
  }

  return (
    <li className="thread">
      <div className="thread-top">
        <img
          className="avatar"
          src={avatarUrl}
          alt={hasAuthor ? `${authorName} avatar` : "Anonymous author avatar"}
          onError={handleAvatarError}
        />

        <div className="thread-main">
          <h3>{thread.title}</h3>
          <p className="meta">by {authorName}</p>
        </div>

        <span className="badge">
          {commentCount} {commentCount === 1 ? "reply" : "replies"}
        </span>
      </div>

      <p>{thread.body}</p>
      {!hasAuthor && (
        <p className="todo">This thread has no author assigned.</p>
      )}
    </li>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
    _count: PropTypes.shape({
      comments: PropTypes.number,
    }),
  }).isRequired,
};
