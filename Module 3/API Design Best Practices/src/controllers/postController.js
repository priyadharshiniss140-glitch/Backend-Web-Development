const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);
  return http.sendList(res, result.posts, result.meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'POST_NOT_FOUND', 'Post not found');
  }
  return http.sendOk(res, post);
}

function createPost(req, res) {
  const body = req.body || {};
  if (typeof body.title !== 'string' || !body.title.trim() ||
      typeof body.author !== 'string' || !body.author.trim()) {
    return http.sendError(
      res,
      400,
      'VALIDATION_ERROR',
      'Both title and author are required'
    );
  }

  const post = service.createPost({
    title: body.title.trim(),
    author: body.author.trim()
  });
  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'POST_NOT_FOUND', 'Post not found');
  }
  return http.sendOk(res, post);
}

function explode() {
  // Intentionally let Express's central error handler produce the safe 500 response.
  return service.explode();
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
