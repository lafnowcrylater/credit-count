// import { drizzle } from 'drizzle-orm/mysql2';
// import mysql from 'mysql2/promise';
// import * as schema from './schema';

// const connection = await mysql.createConnection(
//   process.env.DATABASE_URL || 'mysql://courseuser:coursepass123@db:3306/courses'
// );

// export const db = drizzle(connection, { schema, mode: 'default' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';

let db;

export async function getDb() {
  // If running during build phase, skip DB connection
  if (process.env.BUILD_PHASE === 'true') {
    console.log('Skipping DB connection during build phase');
    return null;
  }

  if (!db) {
    const host = process.env.DOCKER_ENV === 'true' ? 'db' : 'localhost';
    const connectionString =
      process.env.DATABASE_URL ||
      `mysql://courseuser:coursepass123@${host}:3306/courses`;

    const connection = await mysql.createConnection(connectionString);
    db = drizzle(connection, { schema, mode: 'default' });
  }

  return db;
}

// const connection = await mysql.createConnection(
//   process.env.DATABASE_URL || 'mysql://courseuser:coursepass123@:3306/courses'
// );

// export const db = drizzle(connection, { schema, mode: 'default' });
