require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route Handlers
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

// Error Handling Middlewares
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure Database Connection for every incoming request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// JSON API Metadata Route
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: '🚀 The Data Storm - MongoDB Atlas & Express REST API is running',
    version: '1.0.0',
    endpoints: {
      users: '/users or /api/users',
      posts: '/posts or /api/posts',
      recentPosts: '/posts/recent or /api/posts/recent',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Mount Routes (Supports both direct /posts and /api/posts patterns)
app.use('/posts', postRoutes);
app.use('/api/posts', postRoutes);

app.use('/users', userRoutes);
app.use('/api/users', userRoutes);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start HTTP Server when run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
