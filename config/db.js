const mongoose = require('mongoose');
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection err:', err);
    process.exit(1);
  }
}
module.exports = connectDB;