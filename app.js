require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);

// --- 1. Global Middleware ---
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

// --- 2. Swagger Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- 3. Health Check Endpoint ---
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

// --- 4. Database Connection Middleware ---
// This ensures the DB is connected before ANY API route is processed
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed in middleware:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// --- 5. Load Models (Registers schemas in Mongoose) ---
require('./models/User');
require('./models/Category');
require('./models/Event');
require('./models/Registration');
require('./models/Message');

// --- 6. API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// --- 7. Socket.io Logic ---
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

// --- 8. 404 Handler (Must be after all valid routes) ---
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
});

// --- 9. Global Error Handler (Must be the very last middleware) ---
app.use(errorHandler);

// --- 10. Export & Local Server Start ---
module.exports = app;

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`✓ Server running locally on port ${PORT}`);
  });
}