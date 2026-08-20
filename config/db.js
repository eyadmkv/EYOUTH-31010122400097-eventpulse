// config/db.js
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Cache the database connection to avoid exhausting connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we already have a connection, use it!
  if (cached.conn) return cached.conn;

  // If we don't have a promise yet, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents the 10s timeout buffering issue
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✓ MongoDB connected');
      return mongoose;
    }).catch((err) => {
      console.error('MongoDB connection error:', err.message);
      cached.promise = null; // Reset so it can retry next time
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

function getDBStatus() {
  return {
    status: cached.conn ? 'connected' : 'disconnected',
    error: cached.conn ? null : 'Connection pending or failed'
  };
}

module.exports = { connectDB, getDBStatus };