// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import * as schema from './schema';

// const connectionString = process.env.DATABASE_URL || 'postgresql://courseuser:coursepass123@localhost:5432/courses';

// const client = postgres(connectionString);

// export const db = drizzle(client, { schema });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

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
      process.env.DATABASE_URL;
      //  || 'postgresql://courseuser:coursepass123@localhost:5432/courses';

    const connection = await postgres(connectionString);
    db = drizzle(connection, { schema, mode: 'default' });
  }

  return db;
}