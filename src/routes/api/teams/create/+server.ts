import type { InsertOneResult } from 'mongodb';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { NewTeam, TeamUser } from '$lib/models/team.model';
import { getUserFromEvent } from '$lib/server/userService';
import { insertTeam } from '$lib/server/teamService';

export async function POST(event: RequestEvent) {
	const info = await event.request.json();

	const user = await getUserFromEvent(event);
	if (!user) return json({ error: 'User not logged in' }, { status: 401 });

	try {
		const result: InsertOneResult = await insertTeam(info.name, user);
		return json({
			success: result.acknowledged,
			insertedId: result.insertedId
		});
	} catch (e) {
		console.error('Insert team failed:', e);
		return json({ error: 'Failed to insert team' }, { status: 500 });
	}
}
