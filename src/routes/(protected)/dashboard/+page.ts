// import type { Load } from '@sveltejs/kit';

// export const load: Load = async ({ fetch }) => {
// 	const res = await fetch('/api/users/me');

// 	if (!res.ok) {
// 		throw new Error('Failed to fetch user');
// 	}

// 	const currentUser = await res.json();
// 	return { currentUser };
// };