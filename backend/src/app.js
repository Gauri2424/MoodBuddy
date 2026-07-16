import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import moodRouter from './routes/mood.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Apply security middleware with standard helmet headers
// Note: We adjust Content Security Policy (CSP) to allow Spotify/Spotify embeds if using music widgets
app.use(helmet({
  contentSecurityPolicy: false, 
}));

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

// Serve static files from the React frontend build directory (in production)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Catch-all route: redirects any non-API traffic to React's index.html
app.get('*', (req, res) => {
  // If request is looking for an API route that wasn't matched
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Global error handler (must be registered last)
app.use(errorHandler);

export default app;
