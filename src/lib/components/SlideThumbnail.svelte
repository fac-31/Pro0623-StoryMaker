<script lang="ts">
	import type { StoryboardOutput } from '$lib/langgraph/storyboardGraph';
	import { createEventDispatcher } from 'svelte';

	export let slide: StoryboardOutput['visualSlides'][0];
	export let index: number;

	const dispatch = createEventDispatcher<{
		open: number;
	}>();

	function handleDoubleClick() {
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
	class="slide-thumbnail"
	on:dblclick={handleDoubleClick}
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
			<span>No Image</span>
			{#if slide.imagePrompt}
				<small>{slide.imagePrompt.substring(0, 50)}...</small>
			{/if}
		</div>
	{/if}
</div>
