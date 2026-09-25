const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Database] MongoDB Atlas Connected: ${mongoose.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
