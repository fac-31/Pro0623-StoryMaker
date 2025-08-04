import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { UserPrompt } from '$lib/models/UserPrompt';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import { getUserFromEvent } from '$lib/server/userService';
import { getTeamById, isUserInTeam } from '$lib/server/teamService';
import type { Storyboard } from '$lib/models/storyboard.model';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async (event) => {
	const { prompts, team_id } = (await event.request.json()) as {
		prompts: UserPrompt;
		team_id: string | null;
	};

	const user = await getUserFromEvent(event);
	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	if (team_id) {
		const team = await getTeamById(team_id);
		if (!team) return json({ error: 'Invalid team id' }, { status: 404 });

		if (!isUserInTeam(team, user._id.toString()))
			return json({ error: 'User not in team' }, { status: 500 });
	}

	const storyboard: Storyboard = {
		_id: new ObjectId(),
		status: 'none',
		prompts,
		currentSlide: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		storyOutline: {
			storyMetadata: {
				title: '',
				totalDuration: '',
				genre: '',
				style: '',
				targetAudience: ''
			},
			slideOutlines: []
		},
		visualSlides: [],
		characterSheet: ''
	};

	const readableStream = new ReadableStream({
		async start(controller) {
			try {
				const result = await runStoryboardCreation(
					storyboard,
					event.request.signal,
					user._id.toString(),
					team_id ?? undefined
				);
				controller.enqueue(JSON.stringify(result));
				controller.close();
			} catch (error) {
				controller.error(error);
			}
		}
	});

	return new Response(readableStream, {
		headers: {
			'Content-Type': 'text/event-stream'
		}
	});
};
