const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /posts or POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, authorId } = req.body;

    // Validation checks
    if (!title || !content || !authorId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, content, and a valid authorId.',
      });
    }

    // Verify if the referenced user actually exists
    const authorExists = await User.findById(authorId);
    if (!authorExists) {
      return res.status(404).json({
        success: false,
        error: 'Referenced author not found. Please create a user first.',
      });
    }

    const post = await Post.create({
      title,
      content,
      authorId,
    });

    // Populate author details for clean response
    const populatedPost = await post.populate('authorId', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Post created successfully in MongoDB Atlas.',
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (Hydrated with Author details)
// @route   GET /posts or GET /api/posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Top 3 Most Recent Posts (Aggregation / Sorted Query)
// @route   GET /posts/recent or GET /api/posts/recent
exports.getRecentPosts = async (req, res, next) => {
  try {
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('authorId', 'name email');

    return res.status(200).json({
      success: true,
      count: recentPosts.length,
      data: recentPosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single post by ID
// @route   GET /posts/:id or GET /api/posts/:id
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: `No post found with id: ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post by ID
// @route   DELETE /posts/:id or DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        error: `Cannot delete. Post not found with id: ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully from MongoDB Atlas.',
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};
