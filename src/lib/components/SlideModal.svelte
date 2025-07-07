<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { StoryboardOutput } from '$lib/langgraph/storyboardGraph';

	export let storyboard: StoryboardOutput;
	export let selectedSlideIndex: number;
	export let show: boolean = false;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	$: slideOutline = storyboard.storyOutline.slideOutlines[selectedSlideIndex];
	$: visualSlide = storyboard.visualSlides[selectedSlideIndex];

	let triggerElement: HTMLElement | null = null;
	let modalContentElement: HTMLElement;

	function closeModal() {
		if (triggerElement && typeof triggerElement.focus === 'function') {
			triggerElement.focus();
		}
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

	function handleFocusTrap(event: KeyboardEvent) {
		if (event.key !== 'Tab' || !modalContentElement) return;

		const focusableElements = Array.from(
			modalContentElement.querySelectorAll(
				'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
			)
		).filter(
			(el) => (el as HTMLElement).offsetParent !== null // Check for visibility
		) as HTMLElement[];

		if (focusableElements.length === 0) {
			if (document.activeElement !== modalContentElement) {
				modalContentElement.focus();
			}
			event.preventDefault();
			return;
		}

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];
		const currentActiveElement = document.activeElement;

		if (event.shiftKey) {
			// Shift + Tab
			if (currentActiveElement === firstElement || currentActiveElement === modalContentElement) {
				lastElement.focus();
				event.preventDefault();
			}
		} else {
			// Tab
			if (currentActiveElement === lastElement) {
				firstElement.focus();
				event.preventDefault();
			} else if (currentActiveElement === modalContentElement && focusableElements.length > 0) {
				// If focus is on the modal container, move to the first actual interactive element
				firstElement.focus();
				event.preventDefault();
			}
		}
	}

	$: if (show && typeof document !== 'undefined') {
		triggerElement = document.activeElement as HTMLElement;
		tick().then(() => {
			if (modalContentElement) {
				const firstInteractiveFocusable = Array.from(
					modalContentElement.querySelectorAll(
						'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
					)
				).filter((el) => (el as HTMLElement).offsetParent !== null)[0] as HTMLElement | null;

				if (firstInteractiveFocusable) {
					firstInteractiveFocusable.focus();
				} else {
					modalContentElement.focus(); // Fallback to modal content itself
				}
			}
		});
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
			bind:this={modalContentElement}
			class="modal-content"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			aria-labelledby="modal-title"
			on:click|stopPropagation
			on:keydown={handleFocusTrap}
		>
			<button class="close-button" on:click={closeModal}>&times;</button>

			<div class="modal-body">
				<!-- Left side - Slide details (20%) -->
				<div class="slide-details">
					<h3 id="modal-title">Slide {slideOutline.slideId}</h3>

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
