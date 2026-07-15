import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined in the environment variables.');
  process.exit(1);
}

// Create connection pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Helper for running queries
export const query = (text, params) => pool.query(text, params);

// SQL script to initialize tables (Mood entries only, fully anonymous)
const initDbSql = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mood VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    tags TEXT[] NOT NULL,
    note VARCHAR(200),
    ai_summary TEXT NOT NULL
  );
`;

// Initialize the database tables
export const initDatabase = async () => {
  try {
    // Check connection
    const client = await pool.connect();
    console.log('Successfully connected to the PostgreSQL database.');
    client.release();

    // Create tables
    await query(initDbSql);
    console.log('Database tables verified/created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Please make sure PostgreSQL is running and the DATABASE_URL in your .env file is correct.');
  }
};

export default pool;
