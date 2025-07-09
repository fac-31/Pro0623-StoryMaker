<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { Storyboard } from '$lib/models/storyboard.model';

	export let storyboard: Storyboard;
	export let selectedSlideIndex: number;
	export let show: boolean = false;

	let liveRegionMessage = ''; // New variable for the live region

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	$: slideOutline = storyboard.storyOutline.slideOutlines[selectedSlideIndex];
	$: visualSlide = storyboard.visualSlides[selectedSlideIndex];

	let triggerElement: HTMLElement | null = null;
	let modalContentElement: HTMLElement;

	function closeModal() {
		// Focus will be handled by the reactive statement when 'show' becomes false.
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

	$: if (show) {
		liveRegionMessage = 'Slide modal has been opened.';
		if (typeof document !== 'undefined') {
			// Store the element that had focus before the modal opened.
			// This needs to happen before any focus is programmatically moved into the modal.
			triggerElement = document.activeElement as HTMLElement;

			tick().then(() => {
				// Ensure modal is rendered before trying to focus within it.
				if (modalContentElement) {
					const firstInteractiveFocusable = Array.from(
						modalContentElement.querySelectorAll(
							'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
						)
					).filter((el) => (el as HTMLElement).offsetParent !== null)[0] as HTMLElement | null;

					if (firstInteractiveFocusable) {
						firstInteractiveFocusable.focus();
					} else {
						modalContentElement.focus(); // Fallback to modal content itself if no interactive elements are found.
					}
				}
			});
		}
	} else {
		// This block runs when 'show' becomes false (modal is closing).
		liveRegionMessage = ''; // Clear message when modal is not shown.
		if (triggerElement && typeof triggerElement.focus === 'function') {
			// Wait for Svelte to update the DOM (remove the modal) before returning focus.
			tick().then(() => {
				triggerElement?.focus();
				triggerElement = null; // Clear the stored element after focus is returned.
			});
		} else if (triggerElement) {
			// If it exists but can't be focused (e.g., it was removed from DOM for other reasons), just clear it.
			triggerElement = null;
		}
	}
</script>

{#if show}
	<div role="status" aria-live="polite" class="sr-only">
		{liveRegionMessage}
	</div>
	<div
		class="modal-overlay focus:ring-2 focus:ring-gray-300 focus:outline-none"
		role="button"
		tabindex="0"
		aria-label="Close modal"
		on:click={handleOverlayClick}
		on:keydown={handleOverlayKeydown}
	>
		<div
			bind:this={modalContentElement}
			class="modal-content focus:ring-2 focus:ring-blue-500 focus:outline-none"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			aria-labelledby="modal-title"
			on:click|stopPropagation
			on:keydown={handleFocusTrap}
		>
			<button
				class="close-button focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:outline-none"
				on:click={closeModal}
				aria-label="Close slide details">&times;</button
			>

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
