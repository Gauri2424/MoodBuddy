import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import moodRouter from './routes/mood.js';
import errorHandler from './middleware/errorHandler.js';
import { query } from './database/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Apply security middleware with standard helmet headers
// Note: We adjust Content Security Policy (CSP) to allow Spotify/Spotify embeds if using music widgets
app.use(helmet({
  contentSecurityPolicy: false, 
}));

// Configure CORS: allow specified CLIENT_URL or accept requests from the host
const clientUrl = process.env.CLIENT_URL;
app.use(cors({
  origin: clientUrl ? clientUrl.split(',').map(url => url.trim()) : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parser
app.use(express.json());

// Health check route: checks both the server status and PostgreSQL database connection
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      message: 'MoodBuddy backend and PostgreSQL database are healthy',
    });
  } catch (dbErr) {
    res.status(200).json({
      status: 'ok',
      database: 'disconnected',
      dbError: dbErr.message,
      message: 'MoodBuddy backend is running, but cannot connect to the PostgreSQL database.',
      troubleshooting: {
        cause1: 'DATABASE_URL is missing or still pointing to localhost in AWS environment properties.',
        cause2: 'If using AWS RDS, verify the RDS Security Group Inbound Rule allows TCP port 5432.',
        cause3: 'If database enforces SSL, ensure credentials and database endpoint are correct.',
      },
    });
  }
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
