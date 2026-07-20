import app from './app.js';
import { initDatabase } from './database/db.js';
import dotenv from 'dotenv';

dotenv.config();

// AWS Elastic Beanstalk expects port 8080 by default. 
// We use process.env.PORT if defined, or fall back to 8080 for production deployment compatibility.
const PORT = process.env.PORT || 8080;

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
