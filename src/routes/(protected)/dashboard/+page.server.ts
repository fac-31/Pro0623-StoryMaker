// +page.server.ts - Only load storyboard-specific data
import { getStoryboardsOfUser } from '$lib/server/storyboardService.js';
import { getTeamsOfUser } from '$lib/server/teamService.js';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const storyboards = await getStoryboardsOfUser(user.id);

	const teams = await getTeamsOfUser(user.id);

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
