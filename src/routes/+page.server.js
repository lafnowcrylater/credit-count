// import { redirect, fail } from '@sveltejs/kit';

// /** @type {import('./$types').Actions} */
// export const actions = {
//   default: async ({ request }) => {
//     const data = await request.formData();
//     const email = data.get('email');
//     const password = data.get('password');
//     console.log(email + " " + password);

//     if (email === 'a@gmail.com' && password === '123456') {
//       // redirect to /dashboard
//       throw redirect(303, '/dashboard');
//     }

//     console.log('here');
//     return fail(400, { error: 'Invalid email or password.' });
//   }
// };