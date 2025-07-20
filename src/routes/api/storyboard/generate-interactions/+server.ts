import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(event: RequestEvent) {
	try {
		if (!process.env.OPENAI_API_KEY) {
			return json(
				{
					error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.'
				},
				{ status: 500 }
			);
		}

		const { storyboard } = await event.request.json();
		if (!storyboard) {
			return json({ error: 'No storyboard data provided' }, { status: 400 });
		}

		// Construct the prompt
		const prompt = `
Given the following storyboard JSON, generate rich game interactions for each slide. 
Use drag, click, choose, or solve mechanics. Return structured JSON that links each interaction to a scene.

Storyboard JSON:
${JSON.stringify(storyboard, null, 2)}
`;

		// Call OpenAI
		const completion = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{ role: 'system', content: 'You are a game designer AI.' },
				{ role: 'user', content: prompt }
			],
			temperature: 0.7
		});

		// Extract the JSON from the response
		const responseText = completion.choices[0].message.content;
		let interactions;
		try {
			interactions = JSON.parse(responseText!);
		} catch {
			// If the model returns markdown or text, extract JSON
			const match = responseText!.match(/```json([\s\S]*?)```/);
			if (match) {
				interactions = JSON.parse(match[1]);
			} else {
				throw new Error('Could not parse JSON from OpenAI response');
			}
		}

		return json({ success: true, interactions });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}
