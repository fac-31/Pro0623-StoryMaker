<script lang="ts">
	import type { Project } from '$lib/models/project.model';
	import { createEventDispatcher } from 'svelte';

	export let slide: Project['visualSlides'][0];
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
</script>

<div
	class="slide-thumbnail"
	on:dblclick={handleDoubleClick}
	role="button"
	tabindex="0"
	on:keydown={handleKeydown}
>
	<div class="slide-number">Slide {slide.slideNumber}</div>
	{#if slide.imageGenerated && slide.imageUrl}
		<img src={slide.imageUrl} alt="Slide {slide.slideNumber}" />
	{:else}
		<div class="placeholder-image">
			<span>No Image</span>
			{#if slide.imagePrompt}
				<small>{slide.imagePrompt.substring(0, 50)}...</small>
			{/if}
		</div>
	{/if}
</div>
