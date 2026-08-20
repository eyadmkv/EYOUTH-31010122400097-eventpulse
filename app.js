require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  const dbInfo = getDBStatus();
  
  res.status(200).json({ 
    status: 'ok', 
    env: process.env.NODE_ENV, 
    uptime: process.uptime(), 
    db: dbInfo.status,
    dbError: dbInfo.error, 
    mongoUriLoaded: process.env.MONGO_URI ? 'Yes' : 'NO - MISSING IN VERCEL!' 
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

require('./models/User');
require('./models/Category');
require('./models/Event');
require('./models/Registration');
require('./models/Message');

io.on('connection', (socket) => {
  console.log(`✓ User connected: ${socket.id}`);

  socket.on('join-event', (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined room ${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log(`✗ User disconnected: ${socket.id}`);
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
});

app.use(errorHandler);

connectDB().catch((err) => {
  console.error('DB connection failed:', err);
});

module.exports = app;

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`✓ Server running locally on port ${PORT}`);
  });
}