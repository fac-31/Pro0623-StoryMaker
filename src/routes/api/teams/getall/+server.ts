import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getAllTeams } from '$lib/server/teamService';

export async function GET(event: RequestEvent) {
	try {
		return json(await getAllTeams());
	} catch (e) {
		console.error('Get teams failed:', e);
		return json({ error: 'Failed to get teams' }, { status: 500 });
	}
}
