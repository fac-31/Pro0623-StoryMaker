// +page.server.ts - Only load storyboard-specific data
import { getStoryboardsFromIds } from '$lib/server/storyboardService.js';
import { getTeamsOfUser } from '$lib/server/teamService.js';
import { getUserFromSupabaseId, getAllUsers, toSafeUsers } from '$lib/server/userService.js';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
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
		...user.projects as string[],
		...teams.flatMap(team => team.projects as string[]),
	]

	const storyboards = await getStoryboardsFromIds(storyboardIds);

	return {
		supabase,
		user,
		users,
		teams,
		storyboards,
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
			body: JSON.stringify({team_id, user_id, role: 'user'})
		});

		if (!response.ok) {
			const errorData = await response.json();
			return fail(response.status, { error: errorData.error });
		}

		return { success: true };
	},
};