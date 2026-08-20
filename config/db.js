const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true; 
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw new Error('Database connection failed');
  }
}

function getDBStatus() {
  return isConnected ? 'connected' : 'disconnected';
}

module.exports = { connectDB, getDBStatus };