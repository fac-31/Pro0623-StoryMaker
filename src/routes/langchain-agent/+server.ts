import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { concept } = await request.json();
	try {
		const result = await runStoryboardCreation(concept, request.signal);
		return json(result);
	} catch (error) {
		if ((error as Error).name === 'AbortError') {
			return new Response('Request Aborted', { status: 499 });
		}
		return json({ error: (error as Error).message }, { status: 500 });
	}
};
