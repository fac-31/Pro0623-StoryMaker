import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { ElevenLabs } from '@elevenlabs/elevenlabs-js';
import type { StoryboardOutput } from '$lib/langgraph/storyboardGraph';
import 'dotenv/config';

interface VideoGenerationRequest {
	storyboard: StoryboardOutput;
	storyboardId?: string;
}

export async function POST(event: RequestEvent) {
	try {
		// Check for ElevenLabs API key
		if (!process.env.ELEVENLABS_API_KEY) {
			return json(
				{
					error:
						'ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your .env file.'
				},
				{ status: 500 }
			);
		}

		const { storyboard }: VideoGenerationRequest = await event.request.json();

		if (!storyboard || !storyboard.visualSlides || storyboard.visualSlides.length === 0) {
			return json({ error: 'No storyboard data provided' }, { status: 400 });
		}

		// Initialize ElevenLabs
		const elevenlabs = new ElevenLabs({
			apiKey: process.env.ELEVENLABS_API_KEY
		});

		const audioSegments: Array<{
			slideNumber: number;
			audioUrl: string;
			duration: number;
			dialogue: string;
		}> = [];

		// Process each slide to generate audio
		for (let i = 0; i < storyboard.visualSlides.length; i++) {
			const slide = storyboard.visualSlides[i];
			const slideOutline = storyboard.storyOutline.slideOutlines[i];

			if (!slide.imageUrl) {
				console.log(`Skipping slide ${i + 1} - no image URL`);
				continue;
			}

			let audioUrl = '';
			let duration = slideOutline.durationSeconds || 3;
			let dialogue = '';

			if (slideOutline.text.dialogue && slideOutline.text.dialogue.length > 0) {
				try {
					// Combine all dialogue for this slide
					dialogue = slideOutline.text.dialogue.map((d) => `${d.character}: ${d.line}`).join('. ');

					console.log(`Generating audio for slide ${i + 1}: ${dialogue.substring(0, 100)}...`);

					// Generate audio using ElevenLabs
					const audioBuffer = await elevenlabs.text_to_speech.convert({
						text: dialogue,
						voice_id: 'JBFqnCBsd6RMkjVDRZzb', // Default voice from docs
						model_id: 'eleven_multilingual_v2',
						output_format: 'mp3_44100_128'
					});

					// Convert audio buffer to base64 for transmission
					const base64Audio = Buffer.from(audioBuffer).toString('base64');
					audioUrl = `data:audio/mp3;base64,${base64Audio}`;

					// Estimate duration (rough calculation)
					duration = Math.max(duration, 2); // Minimum 2 seconds
				} catch (audioError) {
					console.error(`Audio generation failed for slide ${i + 1}:`, audioError);
					// Continue without audio for this slide
				}
			}

			audioSegments.push({
				slideNumber: i + 1,
				audioUrl,
				duration,
				dialogue
			});
		}

		// Return the processed data for client-side video creation
		return json({
			success: true,
			audioSegments,
			slides: storyboard.visualSlides.map((slide) => ({
				slideNumber: slide.slideNumber,
				imageUrl: slide.imageUrl,
				sceneTitle: storyboard.storyOutline.slideOutlines[slide.slideNumber - 1]?.sceneTitle || ''
			})),
			storyMetadata: storyboard.storyOutline.storyMetadata,
			message: 'Audio generated successfully. Video will be created client-side.'
		});
	} catch (error) {
		console.error('Audio generation failed:', error);
		return json(
			{
				error: error instanceof Error ? error.message : 'Audio generation failed'
			},
			{ status: 500 }
		);
	}
}
