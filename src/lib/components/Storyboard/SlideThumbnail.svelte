<script lang="ts">
	import type { Storyboard } from '$lib/models/storyboard.model';
	import { createEventDispatcher } from 'svelte';

	import { Loader2 } from 'lucide-svelte';

	export let storyboard: Storyboard;
	export let slide: Storyboard['visualSlides'][0];
	export let index: number;

	const dispatch = createEventDispatcher<{
		open: number;
	}>();

	function handleClick() {
		dispatch('open', index);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			dispatch('open', index);
		}
	}

	// Helper for alt text
	$: computedAltText = slide.imagePrompt
		? `Slide ${slide.slideNumber}: ${slide.imagePrompt.substring(0, 100)}${slide.imagePrompt.length > 100 ? '...' : ''}`
		: `Visual representation for Slide ${slide.slideNumber}`;
</script>

<div
	class="slide-thumbnail focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
	on:click={handleClick}
	role="button"
	tabindex="0"
	on:keydown={handleKeydown}
	aria-label={`View details for slide ${slide.slideNumber}${slide.imagePrompt ? ': ' + slide.imagePrompt.substring(0, 50) + '...' : ''}`}
>
	<div class="slide-number">Slide {slide.slideNumber}</div>
	{#if slide.imageGenerated && slide.imageUrl}
		<img src={slide.imageUrl} alt={computedAltText} />
	{:else}
		<div class="placeholder-image">
			{#if storyboard.status == 'generating-image' || storyboard.status == 'uploading-image'}
				<Loader2 class="text-primary mx-auto h-8 w-8 animate-spin motion-reduce:animate-none" />
			{:else}
				<span>No Image</span>
			{/if}

			{#if slide.imagePrompt}
				<small>{slide.imagePrompt.substring(0, 50)}...</small>
			{/if}
		</div>
	{/if}
</div>
