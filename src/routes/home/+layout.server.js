export function load({ locals }) {
  console.log('home layout server:', locals.user);
  return {
    user: locals.user
  };
}