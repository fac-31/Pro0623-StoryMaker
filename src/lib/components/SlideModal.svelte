<script lang="ts">
	import type { Project } from '$lib/models/project.model';
	import { createEventDispatcher } from 'svelte';

	export let storyboard: Project;
	export let selectedSlideIndex: number;
	export let show: boolean = false;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

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
					<h3>Slide {visualSlide.slideNumber}</h3>

					<div class="detail-section">
						<h4>Scene</h4>
						<p><strong>Title:</strong> {visualSlide.sceneTitle}</p>
						<p><strong>Duration:</strong> {visualSlide.durationSeconds}s</p>
						<p><strong>Timestamp:</strong> {visualSlide.timestamp}</p>
					</div>

					<div class="detail-section">
						<h4>Description</h4>
						<p>{visualSlide.sceneDescription}</p>
					</div>

					<div class="detail-section">
						<h4>Visual Style</h4>
						<p>{visualSlide.visualStyle}</p>
						<p><strong>Camera:</strong> {visualSlide.cameraAngle}</p>
					</div>

					{#if visualSlide.characters.length > 0}
						<div class="detail-section">
							<h4>Characters</h4>
							{#each visualSlide.characters as character (visualSlide.slideNumber + character.name)}
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

					{#if visualSlide.text.dialogue.length > 0}
						<div class="detail-section">
							<h4>Dialogue</h4>
							{#each visualSlide.text.dialogue as dialogue (visualSlide.slideNumber + dialogue.line)}
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
