import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'clinic_booking',
  password: process.env.POSTGRES_PASSWORD || '147204',
  port: 5432,
});

pool.on('connect', () => {
  console.log('🛢️  Connected to PostgreSQL Database');
});

export default pool;
