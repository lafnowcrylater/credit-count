import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
    // || 'postgresql://courseuser:coursepass123@localhost:5432/courses'
  }
});

// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   schema: './src/lib/server/db/schema.js',
//   out: './drizzle',
//   dialect: 'mysql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL || 'mysql://courseuser:coursepass123@localhost:3306/courses'
//   }
// });
