import bcrypt from 'bcrypt';
import crypto from 'crypto';
// import { db } from '$lib/server/db';
import { getDb } from '$lib/server/db';
import { users, students, sessions } from './db/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();
const SALT_ROUNDS = 10;

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Create session
export async function createSession(studentId) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  
  await db.insert(sessions).values({
    id: sessionId,
    studentId,
    expiresAt
  });

  return { sessionId, expiresAt };
}

// Validate session
export async function validateSession(sessionId) {
  console.log('DEBUG from validateSession:', sessionId);
  if (!sessionId) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) return null;

  if (new Date() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  const [student] = await db
    .select({
      id: students.id,
      fname: students.fname,
      lname: students.lname,
      degree: students.degree,
      faculty: students.faculty,
      major: students.major,
      yearEnrolled: students.yearEnrolled,
      curriculumId: students.curriculumId,
      status: students.status
    })
    .from(students)
    .where(eq(students.id, session.studentId))
    .limit(1);

  return student;
}

// Delete session (logout)
export async function deleteSession(sessionId) {
  console.log('DEBUG from deleteSession:', sessionId);
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// Login user
export async function loginUser(studentId, password) {
  console.log('DEBUG from loginUser:', studentId);

  // Check if student exists
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) {
    throw new Error('Invalid student ID or password');
  }

  // Check if user account exists
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.studentId, studentId))
    .limit(1);

  if (!user) {
    throw new Error('Invalid student ID or password');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid student ID or password');
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.studentId, studentId));

  return student;
}

// Create user account (admin only)
export async function createUserAccount(studentId, password) {
  // Check if student exists
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) {
    throw new Error('Student not found in database');
  }

  // Check if user account already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.studentId, studentId))
    .limit(1);

  if (existingUser) {
    throw new Error('User account already exists for this student');
  }

  // Create user account
  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    studentId,
    passwordHash
  });

  return { studentId };
}