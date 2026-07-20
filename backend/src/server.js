import app from './app.js';
import { initDatabase } from './database/db.js';
import dotenv from 'dotenv';

dotenv.config();

// AWS Elastic Beanstalk expects port 8080 by default. 
// We use process.env.PORT if defined, or fall back to 8080 for production deployment compatibility.
const PORT = process.env.PORT || 8080;

// Start listening immediately, then initialize the database in the background
const startServer = () => {
  // 1. Bind to the port first so Nginx can connect immediately and the site doesn't hang
  app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  MoodBuddy server running on port: ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`========================================`);
  });

  // 2. Initialize the database asynchronously in the background
  console.log('Initializing MoodBuddy database in the background...');
  initDatabase().catch(err => {
    console.error('Fatal database initialization error:', err.message);
  });
};

startServer();
