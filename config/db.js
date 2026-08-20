const mongoose = require('mongoose');

let isConnected = false;
let connectionError = null;

async function connectDB() {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    connectionError = null;
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    connectionError = err.message; // Save the exact error message
  }
}

function getDBStatus() {
  return {
    status: isConnected ? 'connected' : 'disconnected',
    error: connectionError
  };
}

module.exports = { connectDB, getDBStatus };