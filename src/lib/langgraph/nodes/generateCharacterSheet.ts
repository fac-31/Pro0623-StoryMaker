import type { Storyboard } from '../../models/storyboard.model';
import { addLog } from '$lib/server/storyboardLogStore';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import type { RunnableConfig } from '@langchain/core/runnables';

export const generateCharacterSheet = async (
	state: Storyboard,
	config: RunnableConfig
): Promise<Partial<Storyboard>> => {
	addLog(`[LangGraph] Starting character sheet generation.`);

	// 1. Aggregate all character data from the outline
	const characterData: Record<
		string,
		{ name: string; roles: Set<string>; descriptions: Set<string> }
	> = {};
	for (const slide of state.storyOutline.slideOutlines) {
		for (const ch of slide.characters) {
			if (!characterData[ch.name]) {
				characterData[ch.name] = { name: ch.name, roles: new Set(), descriptions: new Set() };
			}
			characterData[ch.name].roles.add(ch.role);
			characterData[ch.name].descriptions.add(ch.description);
		}
	}

	// 2. Define the synthesis model and prompt once
	const synthesizerLlm = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0 });
	const synthesizerPrompt = ChatPromptTemplate.fromTemplate(`
Based on the following details for a character named "{name}", create a single, cohesive, and definitive visual profile.
This profile will be used as a master reference for an image generation model to ensure visual consistency across multiple scenes.
Combine all unique details into one clear paragraph. Focus on visual appearance.

Character Name: {name}
Known Roles: {roles}
Collected Descriptions:
{descriptions}

Synthesized Profile:`);
	const synthesizerChain = synthesizerPrompt.pipe(synthesizerLlm);

	// 3. Synthesize a profile for each character
	const synthesisPromises = Object.values(characterData).map((charInfo) =>
		synthesizerChain.invoke(
			{
				name: charInfo.name,
				roles: Array.from(charInfo.roles).join(', '),
				descriptions: Array.from(charInfo.descriptions)
					.map((d) => `- ${d}`)
					.join('\n')
			},
			config
		)
	);

	const synthesizedResults = await Promise.all(synthesisPromises);
	// 4. Build the final character sheet string
	const finalSheet = synthesizedResults
		.map((result, index) => {
			const charName = Object.values(characterData)[index].name;
			const profile = (result.content as string).trim();
			return `• ${charName}: ${profile}`;
		})
		.join('\n\n'); // Use double newline for better separation

	addLog(`[LangGraph] Synthesized characterSheet:\n${finalSheet}`);
	return { characterSheet: finalSheet };
};
