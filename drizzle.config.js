// import 'dotenv/config';
// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './src/lib/server/db/schema.js', // adjust if your schema path is different
//   out: './drizzle',
//   dialect: 'mysql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// } satisfies Config;

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.js',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://courseuser:coursepass123@localhost:3306/courses'
  }
});
