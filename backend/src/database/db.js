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

// SQL script to initialize tables
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

  CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) DEFAULT 'Buddy',
    avatar VARCHAR(50) DEFAULT '🦊',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

// Initialize the database tables and insert initial profile if none exists
export const initDatabase = async () => {
  try {
    // Check connection
    const client = await pool.connect();
    console.log('Successfully connected to the PostgreSQL database.');
    client.release();

    // Create tables
    await query(initDbSql);
    console.log('Database tables verified/created successfully.');

    // Seed default user profile if the table is completely empty
    const profileCheck = await query('SELECT COUNT(*) FROM user_profiles');
    if (parseInt(profileCheck.rows[0].count, 10) === 0) {
      await query(
        "INSERT INTO user_profiles (name, avatar) VALUES ($1, $2)",
        ['Buddy', '🦊']
      );
      console.log('Seeded default user profile in the database.');
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Please make sure PostgreSQL is running and the DATABASE_URL in your .env file is correct.');
    // We do not crash the app immediately to allow users to update their .env variables
  }
};

export default pool;
