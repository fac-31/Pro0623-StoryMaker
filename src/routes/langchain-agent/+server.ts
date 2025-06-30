import { json } from '@sveltejs/kit';
import { runStoryboardCreation } from '$lib/langgraph/storyboardGraph';

export const POST = async ({ request }) => {
	const { concept } = await request.json();

	try {
		const result = await runStoryboardCreation(concept);
		return json(result);
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
};
