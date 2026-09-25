const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getRecentPosts,
  getPostById,
  deletePost,
} = require('../controllers/postController');

// Phase 3: Top 3 Most Recent Posts Aggregation route
// Note: /recent must be placed before /:id to prevent route shadowing
router.route('/recent')
  .get(getRecentPosts);

// Phase 1 & 2: Base Posts CRUD routes
router.route('/')
  .post(createPost)
  .get(getPosts);

// Parameterized ID routes
router.route('/:id')
  .get(getPostById)
  .delete(deletePost);

module.exports = router;
