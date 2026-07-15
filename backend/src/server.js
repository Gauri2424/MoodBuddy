import app from './app.js';
import { initDatabase } from './database/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database tables, then start listening
const startServer = async () => {
  console.log('Initializing MoodBuddy database...');
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  MoodBuddy server running on port: ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`========================================`);
  });
};

startServer();
