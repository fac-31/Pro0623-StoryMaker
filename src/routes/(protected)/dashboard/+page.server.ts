// +page.server.ts - Only load storyboard-specific data
import { getStoryboardsFromIds } from '$lib/server/storyboardService.js';
import { getTeamsOfUser } from '$lib/server/teamService.js';
import { getUserFromSupabaseId } from '$lib/server/userService.js';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const mongoUser = await getUserFromSupabaseId(user.id);
	if (!mongoUser) {
		console.log('User not found:', user.id);
		return {};
	}

	const teams = await getTeamsOfUser(mongoUser);

	const storyboardIds: string[] = [
		...mongoUser.projects as string[],
		...teams.flatMap(team => team.projects as string[]),
	]

	const storyboards = await getStoryboardsFromIds(storyboardIds);

	return {
		user,
		storyboards,
		teams
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
	}
};
