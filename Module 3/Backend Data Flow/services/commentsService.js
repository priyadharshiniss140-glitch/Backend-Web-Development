const postsRepo = require('./../repository/postsRepo');
const commentsRepo = require('./../repository/commentsRepo');
const AppError = require('./../utils/AppError');

/**
 * Comment workflow: perform every guard before any write, insert the comment,
 * then increment the post's comment counter and return the inserted comment.
 */
exports.addComment = async (postId, userId, body) => {
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.locked) {
    throw new AppError('Post is locked for new comments', 409);
  }

  const comment = await commentsRepo.insert({
    postId,
    authorId: userId,
    body,
  });

  await postsRepo.incrementCommentCount(postId);

  return comment;
};
