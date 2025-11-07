import { validateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  event.locals.user = null;

  const sessionId = event.cookies.get('session');

  // if (event.url.pathname.startsWith('/favicon') || event.url.pathname.startsWith('/api')) {
  //   return await resolve(event);
  // }
  
  // Validate session and attach user to event.locals
  if (sessionId) {
    try {
      const user = await validateSession(sessionId);
      event.locals.user = user;
    } catch (error) {
      console.error('Session validation failed:', error);
      event.locals.user = null;
    }
  }

  // Protect routes that require authentication
  const protectedRoutes = ['/home', '/courses'];
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !event.locals.user) {
    throw redirect(303, '/');
  }

  // Redirect to home if accessing login while authenticated
  if (event.url.pathname === '/' && event.locals.user) {
    throw redirect(303, '/home');
  }

  return await resolve(event);
}