const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

// Resource-oriented public API.
router.get('/posts', controller.listPosts);
router.get('/posts/:id', controller.getPost);
router.post('/posts', controller.createPost);
router.post('/posts/:id/likes', controller.likePost);

// Deliberately safe demo route for exercising the generic 500 response.
router.get('/__demo/failure', controller.explode);

module.exports = router;
