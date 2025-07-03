<script lang="ts">
	import type { StoryboardOutput, StoryboardResponse } from '$lib/langgraph/storyboardGraph';
	import type { UserPrompt } from '$lib/models/UserPrompt';
	import StoryboardForm from '$lib/components/StoryboardForm.svelte';
	import SlideThumbnail from '$lib/components/SlideThumbnail.svelte';
	import MetadataContainer from '$lib/components/MetadataContainer.svelte';
	import SlideModal from '$lib/components/SlideModal.svelte';

	let userPrompt: UserPrompt = {
		numSlides: 6,
		concept: '',
		storyStyle: '',
		targetAudience: '',
		genre: ''
	};

	let storyboard: (StoryboardOutput & { _id?: string }) | null = null;
	let loading = false;
	let error = '';
	let selectedSlideIndex: number | null = null;
	let showModal = false;

	async function startStoryboard() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/storyboard/start', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userPrompt)
			});
			const data = await res.json();
			if (res.ok) {
				const storyBoardResponse = data as StoryboardResponse;
				storyboard = storyBoardResponse.storyboardOutput;
				//await fetchLogs();
			} else {
				error = data.error || 'Failed to start storyboard';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	function openSlideModal(event: CustomEvent<number>) {
		selectedSlideIndex = event.detail;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedSlideIndex = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleFormSubmit(event: CustomEvent<UserPrompt>) {
		userPrompt = event.detail;
		startStoryboard();
	}

	//not used yet.
	// async function refineSlide() {
	// 	if (!storyboard?._id) return;
	// 	loading = true;
	// 	error = '';
	// 	try {
	// 		const res = await fetch('/api/storyboard/refine', {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify({ _id: storyboard._id, feedback })
	// 		});
	// 		const data = await res.json();
	// 		if (res.ok) {
	// 			storyboard = data;
	// 			imageUrl = '';
	// 			feedback = '';
	// 			await fetchLogs();
	// 		} else {
	// 			error = data.error || 'Failed to refine slide';
	// 		}
	// 	} catch (e) {
	// 		error = e instanceof Error ? e.message : String(e);
	// 	} finally {
	// 		loading = false;
	// 	}
	// }

	// async function approveSlide() {
	// 	if (!storyboard?._id) return;
	// 	loading = true;
	// 	error = '';
	// 	try {
	// 		const res = await fetch('/api/storyboard/approve', {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify({ _id: storyboard._id })
	// 		});
	// 		const data = await res.json();
	// 		if (res.ok) {
	// 			storyboard = data;
	// 			imageUrl = data.currentSlideDraft?.imageUrl || '';
	// 			await fetchLogs();
	// 		} else {
	// 			error = data.error || 'Failed to approve slide';
	// 		}
	// 	} catch (e) {
	// 		error = e instanceof Error ? e.message : String(e);
	// 	} finally {
	// 		loading = false;
	// 	}
	// }

	// async function fetchCurrent() {
	// 	if (!storyboard?._id) return;
	// 	loading = true;
	// 	error = '';
	// 	try {
	// 		const res = await fetch(`/api/storyboard/current?_id=${storyboard._id}`);
	// 		const data = await res.json();
	// 		if (res.ok) {
	// 			storyboard = data;
	// 			imageUrl = data.currentSlideDraft?.imageUrl || '';
	// 			await fetchLogs();
	// 		} else {
	// 			error = data.error || 'Failed to fetch storyboard';
	// 		}
	// 	} catch (e) {
	// 		error = e instanceof Error ? e.message : String(e);
	// 	} finally {
	// 		loading = false;
	// 	}
	// }
</script>

<svelte:window on:keydown={handleKeydown} />

<h1>Storyboard Creator</h1>

{#if !storyboard && !loading}
	<StoryboardForm bind:userPrompt {loading} on:submit={handleFormSubmit} />
{/if}

{#if loading}
	<p>Loading...</p>
{/if}

{#if error}
	<p style="color:red;">{error}</p>
{/if}

{#if storyboard}
	<!-- Visual Slides Horizontal Container -->
	<div class="slides-container">
		<h2>Visual Slides</h2>
		<div class="slides-flex">
			{#each storyboard.visualSlides as slide, index (slide.slideNumber)}
				<SlideThumbnail {slide} {index} on:open={openSlideModal} />
			{/each}
		</div>
	</div>

	<!-- Story Metadata -->
	<MetadataContainer {storyboard} />

	<!-- Modal for detailed slide view -->
	{#if selectedSlideIndex !== null}
		<SlideModal {storyboard} {selectedSlideIndex} show={showModal} on:close={closeModal} />
	{/if}
{/if}
