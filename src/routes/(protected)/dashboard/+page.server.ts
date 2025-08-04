// +page.server.ts - Only load storyboard-specific data
import { getStoryboardsFromIds } from '$lib/server/storyboardService.js';
import { getTeamsOfUser } from '$lib/server/teamService.js';
import { getUserFromSupabaseId, getAllUsers, toSafeUsers } from '$lib/server/userService.js';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ parent, depends }) => {
	depends('dashboard:storyboards');

	console.log("load: PageServerLoad");

	const data = await parent();
	const supabase = data.user;

	const user = await getUserFromSupabaseId(supabase.id);
	if (!user) {
		console.log('User not found:', supabase.id);
		return {};
	}

	const users = toSafeUsers(await getAllUsers());
	const teams = await getTeamsOfUser(user);

	const storyboardIds: string[] = [
		...(user.projects as string[]),
		...teams.flatMap((team) => team.projects as string[])
	];

	const storyboards = await getStoryboardsFromIds(storyboardIds);

	return {
		supabase,
		user,
		users,
		teams,
		storyboards
	};
};

export const actions: Actions = {
	createTeam: async ({ request, fetch }) => {
		const formData = await request.formData();
		const teamName = formData.get('name') as string;

		const newTeam = { name: teamName };

		const response = await fetch('/api/teams/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newTeam)
		});

		if (!response.ok) {
			const errorData = await response.json();
			return fail(response.status, { error: errorData.error });
		}

		return { success: true };
	},

	addUser: async ({ request, fetch }) => {
		const formData = await request.formData();
		const team_id = formData.get('team_id') as string;
		const user_id = formData.get('user_id') as string;

		const response = await fetch('/api/teams/updateuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ team_id, user_id, role: 'user' })
		});

		if (!response.ok) {
			const errorData = await response.json();
			return fail(response.status, { error: errorData.error });
		}

		return { success: true };
	},

	updateUser: async ({ request, fetch }) => {
		const formData = await request.formData();
		const team_id = formData.get('team_id') as string;
		const user_id = formData.get('user_id') as string;
		const role = formData.get('role') as string;

		const response = await fetch('/api/teams/updateuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ team_id, user_id, role })
		});

		if (!response.ok) {
			const errorData = await response.json();
			return fail(response.status, { error: errorData.error });
		}

		return { success: true };
	},

	removeUser: async ({ request, fetch }) => {
		const formData = await request.formData();
		const team_id = formData.get('team_id') as string;
		const user_id = formData.get('user_id') as string;

		console.log(formData);

		const response = await fetch('/api/teams/removeuser', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ team_id, user_id })
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log(errorData);
			return fail(response.status, { error: errorData.error });
		}

		return { success: true };
	},

	changeSettings: async ({ request, locals }) => {
		const form = await request.formData();
		const name = form.get('name')?.toString() ?? '';
		const email = form.get('email')?.toString() ?? '';
		const password = form.get('password')?.toString() ?? '';
		const update: Parameters<typeof locals.supabase.auth.updateUser>[0] = {};
		if (name) update.data = { display_name: name };
		if (email) update.email = email;
		if (password) update.password = password;
		const { error } = await locals.supabase.auth.updateUser(update);
		if (error) return fail(400, { error: error.message });
		return { success: true };
	}
};
