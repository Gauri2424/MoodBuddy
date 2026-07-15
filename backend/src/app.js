import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import moodRouter from './routes/mood.js';
import profileRouter from './routes/profile.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Apply security middleware with standard helmet headers
app.use(helmet());

// Configure CORS to only allow requests from the frontend client URL
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parser
app.use(express.json());

// Base health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MoodBuddy Backend is healthy' });
});

// Register routers
app.use('/api/moods', moodRouter);
app.use('/api/profile', profileRouter);

// Catch-all 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler (must be registered last)
app.use(errorHandler);

export default app;
