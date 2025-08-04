import type { Storyboard } from '../../models/storyboard.model';
import type { VisualSlide } from '../../models/story';
import { addLog } from '$lib/server/storyboardLogStore';
import { updateStream } from '$lib/streams';
import { openai } from '../utils/clients';
import { generateImagePrompt } from '../utils/generateImagePrompt';
import { uploadToCloudinary } from '../utils/cloudinary';
import type { RunnableConfig } from '@langchain/core/runnables';

export const generateImage = async (
	state: Storyboard,
	config: RunnableConfig
): Promise<Partial<Storyboard>> => {
	addLog(`[LangGraph] generateImage called for prompt: ${state.currentSlide}`);
	state.status = 'generating-image';
	updateStream(state._id.toString(), state);

	//create prompt for image generation
	const imagePrompt = generateImagePrompt(
		state.storyOutline.slideOutlines[state.currentSlide - 1],
		state.characterSheet
	);

	try {
		const response = await openai.images.generate(
			{
				model: 'dall-e-3',
				prompt: imagePrompt,
				size: '1792x1024', // Landscape format good for storyboards
				quality: 'standard',
				n: 1
			},
			{ signal: config.signal }
		);

		const dalleImageUrl = response.data && response.data[0] && response.data[0].url;

		if (!dalleImageUrl) {
			console.log('[LangGraph] generateImage failed - no image URL returned');
			addLog('[LangGraph] generateImage failed - no image URL returned');
			return {};
		}

		console.log('[LangGraph] DALL-E image generated:', dalleImageUrl);
		addLog(`[LangGraph] DALL-E image generated: ${dalleImageUrl}`);

		// Update status to indicate uploading to Cloudinary
		state.status = 'uploading-image';
		updateStream(state._id.toString(), state);

		// Upload to Cloudinary for optimization and permanent storage
		let finalImageUrl = dalleImageUrl;
		try {
			console.log('[LangGraph] Uploading to Cloudinary...');
			addLog('[LangGraph] Uploading to Cloudinary...');

			finalImageUrl = await uploadToCloudinary(dalleImageUrl, state.currentSlide);

			console.log('[LangGraph] Cloudinary upload successful:', finalImageUrl);
			addLog(`[LangGraph] Cloudinary upload successful: ${finalImageUrl}`);
		} catch (cloudinaryError) {
			console.warn('[LangGraph] Cloudinary upload failed, using DALL-E URL:', cloudinaryError);
			addLog(`[LangGraph] Cloudinary upload failed, using DALL-E URL: ${cloudinaryError}`);
			// Continue with DALL-E URL if Cloudinary fails
		}

		const visualSlide: VisualSlide = {
			slideNumber: state.currentSlide,
			imageGenerated: true,
			imagePrompt: imagePrompt,
			imageUrl: finalImageUrl
		};

		const updatedVisualSlides = [...state.visualSlides];
		updatedVisualSlides[state.currentSlide - 1] = visualSlide;

		console.log('[LangGraph] generateImage completed successfully');
		addLog('[LangGraph] generateImage completed successfully');

		return {
			visualSlides: updatedVisualSlides
		};
	} catch (error) {
		if ((error as Error).name === 'AbortError') {
			console.log('[LangGraph] Image generation was aborted.');
			addLog('[LangGraph] Image generation was aborted.');
			// Re-throw or handle as appropriate for the graph's state
			throw error;
		}
		console.error('[LangGraph] Image generation failed:', error);
		addLog(`[LangGraph] Image generation failed: ${error}`);
		return {};
	}
};
