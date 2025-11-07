import { mysqlTable, varchar, int, boolean, decimal, timestamp, text } from 'drizzle-orm/mysql-core';
// import { relations } from 'drizzle-orm';

// ============================================
// MASTER DATA (From University)
// ============================================

// Students - imported from university system
export const students = mysqlTable('students', {
  id: varchar('id', { length: 8 }).primaryKey(), // student ID (e.g., 66050001)
  name: varchar('name', { length: 255 }).notNull(),
  faculty: varchar('faculty', { length: 255 }).notNull(),
  major: varchar('major', { length: 255 }).notNull(),
  curriculumId: varchar('curriculum_id', { length: 50 }).notNull(), // e.g., CS-2566
  yearEnrolled: int('year_enrolled').notNull(), // Buddhist year (e.g., 2566)
  status: varchar('status', { length: 50 }).default('active') // active, graduated, suspended
});

// Curriculums - different majors have different requirements
export const curriculums = mysqlTable('curriculums', {
  id: varchar('id', { length: 50 }).primaryKey(), // e.g., CS-2566
  name: varchar('name', { length: 255 }).notNull(), // e.g., หลักสูตร วท.บ. วิทยาการคอมพิวเตอร์ พ.ศ. 2566
  faculty: varchar('faculty', { length: 255 }).notNull(),
  major: varchar('major', { length: 255 }).notNull(),
  year: int('year').notNull(), // curriculum year (2566)
  totalCreditsRequired: int('total_credits_required').notNull(), // e.g., 132
  genEdCreditsRequired: int('gen_ed_credits_required').notNull(), // e.g., 30
  coreCreditsRequired: int('core_credits_required').notNull(), // e.g., 93
  freeElectiveCreditsRequired: int('free_elective_credits_required').notNull() // e.g., 9
});

// Course Catalog - all available courses
export const courseCatalog = mysqlTable('course_catalog', {
  code: varchar('code', { length: 8 }).primaryKey(), // e.g., CS101
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  credits: int('credits').notNull(),
  description: text('description')
});

// Curriculum Requirements - which courses are required for each curriculum
export const curriculumCourses = mysqlTable('curriculum_courses', {
  id: int('id').primaryKey().autoincrement(),
  curriculumId: varchar('curriculum_id', { length: 50 }).notNull().references(() => curriculums.id),
  courseCode: varchar('course_code', { length: 8 }).notNull().references(() => courseCatalog.code),
  courseGroup: varchar('course_group', { length: 20 }).notNull(), // 'gen_ed', 'core', 'elective'
  isRequired: boolean('is_required').default(false), // true = required, false = elective in group
  category: varchar('category', { length: 100 }) // sub-category (e.g., 'มนุษย์ศาสตร์', 'คณิตพื้นฐาน')
});

// ============================================
// STUDENT PROGRESS DATA
// ============================================

// Enrollment Records - courses taken by students
export const enrollments = mysqlTable('enrollments', {
  id: int('id').primaryKey().autoincrement(),
  studentId: varchar('student_id', { length: 8 }).notNull().references(() => students.id),
  courseCode: varchar('course_code', { length: 8 }).notNull().references(() => courseCatalog.code),
  semester: varchar('semester', { length: 20 }).notNull(), // e.g., 1/2566, 2/2566
  grade: varchar('grade', { length: 5 }), // A, B+, B, C+, C, D+, D, F, W, S, U
  gradePoint: decimal('grade_point', { precision: 3, scale: 2 }), // 4.00, 3.50, etc.
  status: varchar('status', { length: 20 }).default('completed'), // enrolled, completed, withdrawn
  countedInGroup: varchar('counted_in_group', { length: 50 }) // which group this counts towards
});

// ============================================
// AUTHENTICATION
// ============================================

// Users - login credentials (linked to students)
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  studentId: varchar('student_id', { length: 8 }).notNull().unique().references(() => students.id),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  lastLogin: timestamp('last_login'),
});

// Sessions
export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  studentId: varchar('student_id', { length: 8 }).notNull().references(() => students.id),
  expiresAt: timestamp('expires_at').notNull()
});

// import { mysqlTable, varchar, int, boolean, decimal, timestamp, text } from 'drizzle-orm/mysql-core';
// import { relations } from 'drizzle-orm';

// // ============================================
// // MASTER DATA (From University)
// // ============================================

// export const students = mysqlTable('students', {
//   id: varchar('id', { length: 8 }).primaryKey(), // student ID (e.g., 66050001)
//   email: varchar('email', { length: 255 }).notNull().unique(),
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
//   code: varchar('code', { length: 20 }).primaryKey(), // e.g., CS101
//   name: varchar('name', { length: 255 }).notNull(),
//   nameEn: varchar('name_en', { length: 255 }),
//   credits: int('credits').notNull(),
//   description: text('description')
// });

// // Curriculum Requirements - which courses are required for each curriculum
// export const curriculumCourses = mysqlTable('curriculum_courses', {
//   id: int('id').primaryKey().autoincrement(),
//   curriculumId: varchar('curriculum_id', { length: 50 }).notNull().references(() => curriculums.id),
//   courseCode: varchar('course_code', { length: 20 }).notNull().references(() => courseCatalog.code),
//   courseGroup: varchar('course_group', { length: 50 }).notNull(), // 'gen_ed', 'core', 'elective'
//   isRequired: boolean('is_required').default(false), // true = required, false = elective in group
//   category: varchar('category', { length: 100 }) // sub-category (e.g., 'มนุษย์ศาสตร์', 'คณิตพื้นฐาน')
// });

// // ============================================
// // STUDENT PROGRESS DATA
// // ============================================

// export const enrollments = mysqlTable('enrollments', {
//   id: int('id').primaryKey().autoincrement(),
//   studentId: varchar('student_id', { length: 8 }).notNull().references(() => students.id),
//   courseCode: varchar('course_code', { length: 20 }).notNull().references(() => courseCatalog.code),
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

// // ============================================
// // RELATIONS (for Drizzle queries)
// // ============================================

// export const studentsRelations = relations(students, ({ one, many }) => ({
//   curriculum: one(curriculums, {
//     fields: [students.curriculumId],
//     references: [curriculums.id]
//   }),
//   enrollments: many(enrollments)
// }));

// export const curriculumsRelations = relations(curriculums, ({ many }) => ({
//   students: many(students),
//   requiredCourses: many(curriculumCourses)
// }));

// export const courseCatalogRelations = relations(courseCatalog, ({ many }) => ({
//   curriculumCourses: many(curriculumCourses),
//   enrollments: many(enrollments)
// }));

// export const curriculumCoursesRelations = relations(curriculumCourses, ({ one }) => ({
//   curriculum: one(curriculums, {
//     fields: [curriculumCourses.curriculumId],
//     references: [curriculums.id]
//   }),
//   course: one(courseCatalog, {
//     fields: [curriculumCourses.courseCode],
//     references: [courseCatalog.code]
//   })
// }));

// export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
//   student: one(students, {
//     fields: [enrollments.studentId],
//     references: [students.id]
//   }),
//   course: one(courseCatalog, {
//     fields: [enrollments.courseCode],
//     references: [courseCatalog.code]
//   })
// }));