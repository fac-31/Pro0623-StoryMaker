<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { Loader2 } from 'lucide-svelte';
	import type { Storyboard } from '$lib/models/storyboard.model';
	import type { SlideOutline } from '$lib/models/story';
	import SlideForm from './SlideForm.svelte';

	export let storyboard: Storyboard;
	export let selectedSlideIndex: number;
	export let show: boolean = false;
	export let isNewSlide: boolean = false;
	export let progressStoryboard: (
		id: string,
		edit: boolean,
		slideNumber?: number
	) => Promise<Storyboard>;

	let editing = false;
	let loading = false;

	let error = '';
	let liveRegionMessage = ''; // New variable for the live region

	const dispatch = createEventDispatcher<{
		close: void;
		update: Storyboard;
	}>();

	// Create a local, editable copy of the slide outline.
	let editableSlideOutline: SlideOutline;

	// This reactive block re-initializes the form whenever the selected slide changes.
	$: {
		if (isNewSlide) {
			editableSlideOutline = {
				slideId: 0,
				sceneTitle: 'New Scene',
				durationSeconds: 10,
				timestamp: '0:00',
				sceneDescription: '',
				visualStyle: '',
				cameraAngle: '',
				characters: [],
				text: { dialogue: [] }
			};
			editing = true; // Start in editing mode for new slides
		} else {
			// Deep copy to prevent mutating the original storyboard object directly.
			editableSlideOutline = JSON.parse(
				JSON.stringify(storyboard.storyOutline.slideOutlines[selectedSlideIndex])
			);
			// Reset editing state when the slide changes
			editing = false;
		}
	}

	$: visualSlide = isNewSlide ? null : storyboard.visualSlides[selectedSlideIndex];

	let triggerElement: HTMLElement | null = null;
	let modalContentElement: HTMLElement;

	function closeModal() {
		if (triggerElement && typeof triggerElement.focus === 'function') {
			triggerElement.focus();
		}
		dispatch('close');
	}

	function handleOverlayClick() {
		// Prevent closing modal when in editing mode
		if (!editing) {
			closeModal();
		}
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		// Prevent closing modal when in editing mode
		if (!editing && (event.key === 'Enter' || event.key === ' ')) {
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
	} else {
		liveRegionMessage = ''; // Clear message when modal is not shown
	}

	async function saveChanges() {
		loading = true;
		error = '';
		try {
			const url = isNewSlide ? '/api/storyboard/add-slide' : '/api/storyboard/edit';
			const body = isNewSlide
				? {
						newSlideOutline: editableSlideOutline,
						insertionIndex: selectedSlideIndex,
						storyboard_id: storyboard._id
					}
				: {
						newSlideOutline: editableSlideOutline,
						slideNumber: selectedSlideIndex + 1,
						storyboard_id: storyboard._id
					};

			const res = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(body)
			});
			const data = await res.json();
			if (res.ok) {
				const storyboard_id = data.id;
				const edit = true;
				const slideNumber = isNewSlide ? selectedSlideIndex + 1 : selectedSlideIndex + 1;
				const updatedStoryboard = await progressStoryboard(storyboard_id, edit, slideNumber);
				if (updatedStoryboard) {
					dispatch('update', updatedStoryboard);
				}
				editing = false; // Exit editing mode on success
				closeModal();
			} else {
				error = data.error || 'Failed to save storyboard';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	function cancelEdit() {
		if (isNewSlide) {
			closeModal();
			return;
		}
		// Revert changes by re-copying the original data
		editableSlideOutline = JSON.parse(
			JSON.stringify(storyboard.storyOutline.slideOutlines[selectedSlideIndex])
		);
		editing = false;
	}
</script>

{#if show}
	<div role="status" aria-live="assertive" class="sr-only">
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
					<h3 id="modal-title">
						{isNewSlide ? 'Add New Slide' : `Slide ${editableSlideOutline.slideId}`}
					</h3>

					<SlideForm {editableSlideOutline} {editing} />
				</div>

				<!-- Right side - Image (80%) -->
				<div class="slide-image">
					{#if loading}
						<div class="flex h-full items-center justify-center">
							<div class="text-center">
								<Loader2
									class="text-primary mx-auto h-8 w-8 animate-spin motion-reduce:animate-none"
								/>
								<p class="text-base-content/70 mt-4">Updating slide...</p>
							</div>
						</div>
					{:else if visualSlide && visualSlide.imageGenerated && visualSlide.imageUrl}
						<img src={visualSlide.imageUrl} alt="Slide {visualSlide.slideNumber}" />
					{:else}
						<div class="large-placeholder">
							<h3>
								{isNewSlide ? 'Fill out the form to generate an image' : 'No Image Generated'}
							</h3>
							{#if visualSlide && visualSlide.imagePrompt}
								<p><strong>Image Prompt:</strong></p>
								<p>{visualSlide.imagePrompt}</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
			{#if error}
				<div class="error-message mb-4 rounded border border-red-200 bg-red-50 p-2 text-red-600">
					{error}
				</div>
			{/if}
			<div class="modal-footer">
				{#if editing}
					<button class="btn btn-primary" on:click={cancelEdit} disabled={loading}>Cancel</button>
					<button class="btn btn-primary" on:click={saveChanges} disabled={loading}
						>{isNewSlide ? 'Save & Generate' : 'Save'}</button
					>
				{:else}
					<button class="btn btn-primary" on:click={() => (editing = true)}>Edit</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
