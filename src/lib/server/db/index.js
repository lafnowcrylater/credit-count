import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db;

export function getDb() {
  if (db) return db;
  const connectionString = process.env.DATABASE_URL || 'postgresql://courseuser:coursepass123@localhost:5432/courses';
  const sql = postgres(connectionString, {
    ssl: connectionString.includes('render.com') ? { rejectUnauthorized: false } : false
  });
  db = drizzle(sql, { schema });
  return db;
}