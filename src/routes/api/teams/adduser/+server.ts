import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

import { teamRoles } from '$lib/models/team.model';
import type { TeamUser } from '$lib/models/team.model';
import { getUserFromEvent } from '$lib/server/userService';
import { getTeamById, addUserToTeam } from '$lib/server/teamService';

export async function POST(event: RequestEvent) {
	const info = await event.request.json();

	const user = await getUserFromEvent(event);
	if (!user) return json({ error: 'User not logged in' }, { status: 401 });

	try {
		const team = await getTeamById(info.team_id);
		if (!team) return json({ error: 'Could not find team by id ' + info.team_id }, { status: 404 });

		const teamUser: TeamUser | undefined = team.users.find((teamUser) =>
			teamUser.user.equals(user._id)
		);

		if (!teamUser) return json({ error: 'You are not in this team to edit' }, { status: 401 });

		if (teamUser.role !== 'admin')
			return json({ error: 'Not an admin to edit this team' }, { status: 401 });

		if (!teamRoles.includes(info.role))
			return json({ error: 'Invalid role ' + info.role }, { status: 401 });

		await addUserToTeam(info.team_id, info.user_id, info.role);
		return json({ success: true });
	} catch (e) {
		console.error('Insert team failed:', e);
		return json({ error: 'Failed to insert team' }, { status: 500 });
	}
}
