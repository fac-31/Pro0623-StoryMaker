import type { SlideOutline } from '$lib/models/story';

export const generateImagePrompt = (slide: SlideOutline, characterSheet: string): string => {
	const promptParts: string[] = [];
	// Add scene description & Charactersheet
promptParts.push(`Character Profiles:${characterSheet}`);
promptParts.push('Please follow the character profiles above exactly—do not alter appearance between panels.');
promptParts.push(`Scene: ${slide.sceneDescription}`);
// Add character descriptions
const characterNames: string[] = [];slide.characters.forEach((char) => {characterNames.push(char.name);
let charDesc = `${char.name}: ${char.description}, positioned ${char.position}`;
if (char.emotions.length > 0) {charDesc += `, expressing ${char.emotions.join(', ')}`;}
promptParts.push(charDesc);});// Add visual style and camera
promptParts.push(`Visual style: ${slide.visualStyle}`);
promptParts.push(`Camera angle: ${slide.cameraAngle}`);
const fullPrompt = `Storyboard panel: ${promptParts.join('. ')}. Professional illustration style, clean lines, suitable for storyboard presentation.`;
return fullPrompt;
};

import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export const rewritePrompt = async (original: string, instruction: string): Promise<string> => {
	const systemPrompt = `
	You are a helpful AI that rewrites image generation prompts based on natural language edits.

	Original prompt: "{{original}}"
	Edit instruction: "{{instruction}}"

	Return a revised prompt that incorporates the instruction cleanly, but keeps the original intent. If the description of the character
	differs betweeen the original and the new instructions, you should defer to the new instructions. 
	`.trim();

	const response = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: `Original prompt: ${original}\nInstruction: ${instruction}` }
		],
		temperature: 0.7
	});

	return response.choices[0]?.message.content?.trim() || original;
};