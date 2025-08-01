import type { SlideOutline } from '../../models/story';
export const generateImagePrompt = (slide: SlideOutline, characterSheet: string): string => {
	const promptParts: string[] = []; // Add scene description & Charactersheet
	promptParts.push(`Character Profiles:\n${characterSheet}`);
	promptParts.push(
		'Please follow the character profiles above exactly—do not alter appearance between panels.'
	);
	promptParts.push(`Scene: ${slide.sceneDescription}`); // Add character descriptions
	const characterNames: string[] = [];
	slide.characters.forEach((char) => {
		characterNames.push(char.name);
		let charDesc = `${char.name}: ${char.description}, positioned ${char.position}`;
		if (char.emotions.length > 0) {
			charDesc += `, expressing ${char.emotions.join(', ')}`;
		}
		promptParts.push(charDesc);
	}); // Add visual style and camera
	promptParts.push(`Visual style: ${slide.visualStyle}`);
	promptParts.push(`Camera angle: ${slide.cameraAngle}`);
	const fullPrompt = `Storyboard panel: ${promptParts.join('. ')}. Professional illustration style, clean lines, suitable for storyboard presentation.`;
	return fullPrompt;
};
