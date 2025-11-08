import { pgTable, varchar, integer, boolean, decimal, timestamp, text, serial } from 'drizzle-orm/pg-core';

// ============================================
// MASTER DATA (From University)
// ============================================

// Students
export const students = pgTable('students', {
  id: varchar('id', { length: 8 }).primaryKey(),
  fname: varchar('fname', { length: 100 }).notNull(),
  lname: varchar('lname', { length: 100 }).notNull(),
  degree: varchar('degree', { length: 100 }).notNull(),
  faculty: varchar('faculty', { length: 255 }).notNull(),
  major: varchar('major', { length: 255 }).notNull(),
  curriculumId: varchar('curriculum_id', { length: 20 }).notNull(),
  yearEnrolled: integer('year_enrolled').notNull(),
  status: varchar('status', { length: 50 }).default('active')
});

// Curriculums
export const curriculums = pgTable('curriculums', {
  id: varchar('id', { length: 20 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 100 }).notNull(),
  faculty: varchar('faculty', { length: 255 }).notNull(),
  major: varchar('major', { length: 255 }).notNull(),
  year: integer('year').notNull(),
  totalCreditsRequired: integer('total_credits_required').notNull(),
  genEdCreditsRequired: integer('gen_ed_credits_required').notNull(),
  coreCreditsRequired: integer('core_credits_required').notNull(),
  freeElectiveCreditsRequired: integer('free_elective_credits_required').notNull()
});

// Course Catalog
export const courseCatalog = pgTable('course_catalog', {
  code: varchar('code', { length: 8 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  credits: integer('credits').notNull(),
  description: text('description')
});

// Curriculum Requirements
export const curriculumCourses = pgTable('curriculum_courses', {
  id: serial('id').primaryKey(),
  curriculumId: varchar('curriculum_id', { length: 20 }).notNull().references(() => curriculums.id),
  courseCode: varchar('course_code', { length: 8 }).notNull().references(() => courseCatalog.code),
  courseGroup: varchar('course_group', { length: 20 }).notNull(),
  isRequired: boolean('is_required').default(false),
  category: varchar('category', { length: 100 })
});

// ============================================
// STUDENT PROGRESS DATA
// ============================================

// Enrollment Records
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: varchar('student_id', { length: 8 }).notNull().references(() => students.id),
  courseCode: varchar('course_code', { length: 8 }).notNull().references(() => courseCatalog.code),
  semester: varchar('semester', { length: 20 }).notNull(),
  grade: varchar('grade', { length: 5 }),
  gradePoint: decimal('grade_point', { precision: 3, scale: 2 }),
  status: varchar('status', { length: 20 }).default('completed'),
  countedInGroup: varchar('counted_in_group', { length: 50 })
});

// ============================================
// AUTHENTICATION
// ============================================

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  studentId: varchar('student_id', { length: 8 }).notNull().unique().references(() => students.id),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  lastLogin: timestamp('last_login').defaultNow(),
});

// Sessions
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  studentId: varchar('student_id', { length: 20 }).notNull().references(() => students.id),
  expiresAt: timestamp('expires_at').notNull()
});

// import { mysqlTable, varchar, int, boolean, decimal, timestamp, text } from 'drizzle-orm/mysql-core';
// // import { relations } from 'drizzle-orm';

// // ============================================
// // MASTER DATA (From University)
// // ============================================

// // Students - imported from university system
// export const students = mysqlTable('students', {
//   id: varchar('id', { length: 8 }).primaryKey(), // student ID (e.g., 66050001)
//   name: varchar('name', { length: 255 }).notNull(),
//   faculty: varchar('faculty', { length: 255 }).notNull(),
//   major: varchar('major', { length: 255 }).notNull(),
//   curriculumId: varchar('curriculum_id', { length: 50 }).notNull(), // e.g., CS-2566
//   yearEnrolled: int('year_enrolled').notNull(), // Buddhist year (e.g., 2566)
//   status: varchar('status', { length: 50 }).default('active') // active, graduated, suspended
// });

// // Curriculums - different majors have different requirements
// export const curriculums = mysqlTable('curriculums', {
//   id: varchar('id', { length: 50 }).primaryKey(), // e.g., CS-2566
//   name: varchar('name', { length: 255 }).notNull(), // e.g., หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ พ.ศ. 2566
//   faculty: varchar('faculty', { length: 255 }).notNull(),
//   major: varchar('major', { length: 255 }).notNull(),
//   year: int('year').notNull(), // curriculum year (2566)
//   totalCreditsRequired: int('total_credits_required').notNull(), // e.g., 132
//   genEdCreditsRequired: int('gen_ed_credits_required').notNull(), // e.g., 30
//   coreCreditsRequired: int('core_credits_required').notNull(), // e.g., 93
//   freeElectiveCreditsRequired: int('free_elective_credits_required').notNull() // e.g., 9
// });

// // Course Catalog - all available courses
// export const courseCatalog = mysqlTable('course_catalog', {
//   code: varchar('code', { length: 8 }).primaryKey(), // e.g., CS101
//   name: varchar('name', { length: 255 }).notNull(),
//   nameEn: varchar('name_en', { length: 255 }),
//   credits: int('credits').notNull(),
//   description: text('description')
// });

// // Curriculum Requirements - which courses are required for each curriculum
// export const curriculumCourses = mysqlTable('curriculum_courses', {
//   id: int('id').primaryKey().autoincrement(),
//   curriculumId: varchar('curriculum_id', { length: 50 }).notNull().references(() => curriculums.id),
//   courseCode: varchar('course_code', { length: 8 }).notNull().references(() => courseCatalog.code),
//   courseGroup: varchar('course_group', { length: 20 }).notNull(), // 'gen_ed', 'core', 'elective'
//   isRequired: boolean('is_required').default(false), // true = required, false = elective in group
//   category: varchar('category', { length: 100 }) // sub-category (e.g., 'มนุษย์ศาสตร์', 'คณิตพื้นฐาน')
// });

// // ============================================
// // STUDENT PROGRESS DATA
// // ============================================

// // Enrollment Records - courses taken by students
// export const enrollments = mysqlTable('enrollments', {
//   id: int('id').primaryKey().autoincrement(),
//   studentId: varchar('student_id', { length: 8 }).notNull().references(() => students.id),
//   courseCode: varchar('course_code', { length: 8 }).notNull().references(() => courseCatalog.code),
//   semester: varchar('semester', { length: 20 }).notNull(), // e.g., 1/2566, 2/2566
//   grade: varchar('grade', { length: 5 }), // A, B+, B, C+, C, D+, D, F, W, S, U
//   gradePoint: decimal('grade_point', { precision: 3, scale: 2 }), // 4.00, 3.50, etc.
//   status: varchar('status', { length: 20 }).default('completed'), // enrolled, completed, withdrawn
//   countedInGroup: varchar('counted_in_group', { length: 50 }) // which group this counts towards
// });

// // ============================================
// // AUTHENTICATION
// // ============================================

// // Users - login credentials (linked to students)
// export const users = mysqlTable('users', {
//   id: int('id').primaryKey().autoincrement(),
//   studentId: varchar('student_id', { length: 8 }).notNull().unique().references(() => students.id),
//   passwordHash: varchar('password_hash', { length: 255 }).notNull(),
//   lastLogin: timestamp('last_login'),
// });

// // Sessions
// export const sessions = mysqlTable('sessions', {
//   id: varchar('id', { length: 255 }).primaryKey(),
//   studentId: varchar('student_id', { length: 8 }).notNull().references(() => students.id),
//   expiresAt: timestamp('expires_at').notNull()
// });