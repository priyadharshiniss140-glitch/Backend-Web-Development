
const express = require('express');
const auditWrite = require('../middleware/auditWrite');

const router = express.Router();

// GET /posts — no audit middleware
router.get('/', (req, res) => {
  res.json([]);
});

// POST /posts — audit middleware runs only here
router.post('/', auditWrite, (req, res) => {
  res.status(201).json({
    message: 'Post created successfully',
    post: req.body
  });
});

module.exports = router;
