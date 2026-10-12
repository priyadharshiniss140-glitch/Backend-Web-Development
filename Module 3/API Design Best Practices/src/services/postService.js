const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 5;

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function nonNegativeInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function listPosts(query = {}) {
  const allPosts = store.getAllPosts()
    .sort((a, b) => b.createdAt - a.createdAt);

  const requestedLimit = positiveInteger(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const offset = nonNegativeInteger(query.offset, 0);
  const posts = allPosts.slice(offset, offset + limit);
  const total = allPosts.length;
  const nextOffset = offset + posts.length;

  return {
    posts,
    meta: {
      total,
      limit,
      offset,
      hasMore: nextOffset < total,
      nextOffset: nextOffset < total ? nextOffset : null
    }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  // A missing resource is handled as a 404 by the controller, not an internal error.
  return store.incrementLikes(id);
}

function explode() {
  // Deliberately simulate an internal failure for the demo endpoint.
  // The public error handler must not expose this message or debug details.
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  err.debug = 'FakeStack: at postService.js:19:11';
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
