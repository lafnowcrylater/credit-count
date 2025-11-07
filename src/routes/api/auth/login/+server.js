import { json } from '@sveltejs/kit';
import { loginUser, createSession } from '$lib/server/auth';

export async function POST({ request, cookies }) {
  try {
    const { studentId, password } = await request.json();

    // Validate input
    if (!studentId || !password) {
      return json({ error: 'Student ID and password are required' }, { status: 400 });
    }

    // Login user
    const student = await loginUser(studentId, password);

    // Create session
    const { sessionId, expiresAt } = await createSession(student.id);

    // Set cookie
    cookies.set('session', sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        faculty: student.faculty,
        major: student.major,
        year: student.year
      }
    });
  } catch (error) {
    return json({ error: error.message }, { status: 401 });
  }
}