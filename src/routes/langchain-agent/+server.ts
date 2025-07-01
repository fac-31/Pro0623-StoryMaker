import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { concept } = await request.json();

	try {
		const result = await runStoryboardCreation(concept);
		return json(result);
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 500 });
	}
};
