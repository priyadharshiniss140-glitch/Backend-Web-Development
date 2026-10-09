
/**
 * Posts router (already written). Mounted at /posts in app.js.
 *
 * PER-ROUTE MOUNTING:
 * auditWrite runs only when someone creates a post.
 */

const express = require('express');
const router = express.Router();

const auditWrite = require('../middleware/auditWrite');

const posts = [{ id: 1, title: 'Hello World' }];

// Public read — no extra audit middleware.
router.get('/', (req, res) => {
  res.json({ data: posts });
});

// Create a post — auditWrite runs only for this route.
router.post('/', auditWrite, (req, res) => {
  const post = {
    id: posts.length + 1,
    title: req.body.title || 'Untitled'
  };

  posts.push(post);
  res.status(201).json({ data: post });
});

module.exports = router;
