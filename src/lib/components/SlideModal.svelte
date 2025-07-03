<script lang="ts">
	import type { StoryboardOutput } from '$lib/langgraph/storyboardGraph';
	import { createEventDispatcher } from 'svelte';

	export let storyboard: StoryboardOutput;
	export let selectedSlideIndex: number;
	export let show: boolean = false;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	$: slideOutline = storyboard.storyOutline.slideOutlines[selectedSlideIndex];
	$: visualSlide = storyboard.visualSlides[selectedSlideIndex];

	function closeModal() {
		dispatch('close');
	}

	function handleOverlayClick() {
		closeModal();
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			closeModal();
		}
	}
</script>

{#if show}
	<div
		class="modal-overlay"
		role="button"
		tabindex="0"
		aria-label="Close modal"
		on:click={handleOverlayClick}
		on:keydown={handleOverlayKeydown}
	>
		<div
			class="modal-content"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<button class="close-button" on:click={closeModal}>&times;</button>

			<div class="modal-body">
				<!-- Left side - Slide details (20%) -->
				<div class="slide-details">
					<h3>Slide {slideOutline.slideId}</h3>

					<div class="detail-section">
						<h4>Scene</h4>
						<p><strong>Title:</strong> {slideOutline.sceneTitle}</p>
						<p><strong>Duration:</strong> {slideOutline.durationSeconds}s</p>
						<p><strong>Timestamp:</strong> {slideOutline.timestamp}</p>
					</div>

					<div class="detail-section">
						<h4>Description</h4>
						<p>{slideOutline.sceneDescription}</p>
					</div>

					<div class="detail-section">
						<h4>Visual Style</h4>
						<p>{slideOutline.visualStyle}</p>
						<p><strong>Camera:</strong> {slideOutline.cameraAngle}</p>
					</div>

					{#if slideOutline.characters.length > 0}
						<div class="detail-section">
							<h4>Characters</h4>
							{#each slideOutline.characters as character (slideOutline.slideId + character.name)}
								<div class="character-info">
									<strong>{character.name}</strong> ({character.role})
									<p>{character.description}</p>
									<small>Position: {character.position}</small>
									{#if character.emotions.length > 0}
										<div class="emotions">Emotions: {character.emotions.join(', ')}</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}

					{#if slideOutline.text.dialogue.length > 0}
						<div class="detail-section">
							<h4>Dialogue</h4>
							{#each slideOutline.text.dialogue as dialogue (slideOutline.slideId + dialogue.line)}
								<div class="dialogue-line">
									<strong>{dialogue.character}:</strong> "{dialogue.line}"
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Right side - Image (80%) -->
				<div class="slide-image">
					{#if visualSlide.imageGenerated && visualSlide.imageUrl}
						<img src={visualSlide.imageUrl} alt="Slide {visualSlide.slideNumber}" />
					{:else}
						<div class="large-placeholder">
							<h3>No Image Generated</h3>
							{#if visualSlide.imagePrompt}
								<p><strong>Image Prompt:</strong></p>
								<p>{visualSlide.imagePrompt}</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
