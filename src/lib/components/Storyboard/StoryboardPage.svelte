<script lang="ts">
	import type { Storyboard } from '$lib/models/storyboard.model';
	import type { Team } from '$lib/models/team.model';
	import type { UserPrompt } from '$lib/models/UserPrompt';
	import StoryboardForm from '$lib/components/Storyboard/StoryboardForm.svelte';
	import SlideThumbnail from '$lib/components/Storyboard/SlideThumbnail.svelte';
	import SlideModal from '$lib/components/Storyboard/SlideModal.svelte';
	import { Loader2, ArrowLeft, Sparkles, PlusCircle } from 'lucide-svelte';
	import { invalidate } from '$app/navigation';

	let userPrompt: UserPrompt = {
		numSlides: 6,
		concept: '',
		storyStyle: '',
		targetAudience: '',
		genre: ''
	};

	export let storyboard: Storyboard | null = null;
	export let team: Team | null = null;
	let loading = false;
	let error = '';
	let selectedSlideIndex: number | null = null;
	let showModal = false;
	let gameUrl: string | null = null;
	let isNewSlide = false;

	async function generateGame() {
		if (!storyboard?._id) return;
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/storyboard/generate-game', {
				method: 'POST',
				body: JSON.stringify({ storyboardId: storyboard._id })
			});
			const data = await res.json();
			if (res.ok) {
				window.location.href = data.gamePath;
			} else {
				error = data.error || 'Failed to generate game';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function progressStoryboard(
		id: string,
		edit: boolean,
		slideNumber?: number
	): Promise<Storyboard> {
		return new Promise((resolve, reject) => {
			let url = `/api/storyboard/progress/${id}`;
			const params = new URLSearchParams();
			if (edit) params.append('edit', 'true');
			if (slideNumber) params.append('slideNumber', slideNumber.toString());
			if (params.toString()) url += `?${params.toString()}`;

			const source = new EventSource(url);
			source.onmessage = (event) => {
				storyboard = JSON.parse(event.data);

				if (storyboard && storyboard.status == 'done') {
					source.close();
					resolve(storyboard);
				}
			};

			source.onerror = (err) => {
				console.error('SSE connection error', err);
				source.close();
				reject(new Error('SSE connection error'));
			};
		});
	}

	async function startStoryboard() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/storyboard/start', {
				method: 'POST',
				body: JSON.stringify({
					prompts: userPrompt,
					team_id: team?._id
				})
			});
			const data = await res.json();
			if (res.ok) {
				const id = data.insertedId;
				await progressStoryboard(id, false);
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
		isNewSlide = false;
		showModal = true;
	}

	function addNewSlide(index: number) {
		selectedSlideIndex = index;
		isNewSlide = true;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedSlideIndex = null;
		isNewSlide = false;
	}

	function handleStoryboardUpdate(event: CustomEvent<Storyboard>) {
		storyboard = event.detail;
		// Invalidate the dashboard data so it refreshes when user navigates back
		invalidate('dashboard:storyboards');
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
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="bg-base-200 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl space-y-8">
		<!-- Header with Back Button and Title -->
		<header class="flex items-center justify-between">
			<div class="flex items-center space-x-4">
				<button
					onclick={() => {
						sessionStorage.setItem('team', JSON.stringify(team));
						window.history.back();
					}}
					class="btn btn-ghost btn-sm"
					aria-label="Go back to previous page"
				>
					<ArrowLeft class="h-5 w-5" />
					<span class="hidden sm:inline">Back</span>
				</button>

				{#if storyboard}
					<div>
						<h1 class="text-base-content text-3xl font-bold">
							{storyboard.storyOutline.storyMetadata.title}
						</h1>
						<p class="text-base-content/70 mt-1">
							{storyboard.storyOutline.storyMetadata.genre} • {storyboard.storyOutline.storyMetadata
								.targetAudience} • {storyboard.storyOutline.storyMetadata.style} • {storyboard
								.storyOutline.storyMetadata.totalDuration}
						</p>
					</div>
				{:else}
					<div>
						<h1 class="text-base-content text-3xl font-bold">Create New Storyboard</h1>
						<p class="text-base-content/70 mt-1">Transform your story ideas into visual magic</p>
						{#if team}
							<p class="text-yellow-600">
								You are creating a storyboard for {team.name}
							</p>
						{/if}
					</div>
				{/if}
			</div>

			{#if storyboard}
				<div class="flex items-center space-x-2">
					<div class="badge badge-primary">
						{storyboard.visualSlides.length} slides
					</div>
					<div class="badge badge-outline">
						{storyboard.status}
					</div>
				</div>
			{/if}
		</header>

		<!-- Main Content -->
		<section aria-label="Storyboard creation and display" class="card bg-base-100 shadow-xl">
			<div class="card-body">
				{#if !storyboard && !loading}
					<StoryboardForm bind:userPrompt {loading} on:submit={handleFormSubmit} />
				{/if}

				{#if error}
					<div class="alert alert-error">
						<span>{error}</span>
					</div>
				{/if}

				{#if loading && (!storyboard || storyboard.status == 'none' || storyboard.status == 'generating-outline')}
					<div class="flex items-center justify-center py-12">
						<div class="text-center">
							<Loader2
								class="text-primary mx-auto h-8 w-8 animate-spin motion-reduce:animate-none"
							/>
							{#if storyboard && storyboard.status == 'generating-outline'}
								<p class="text-base-content/70 mt-4">Creating outlines...</p>
							{:else}
								<p class="text-base-content/70 mt-4">Creating your storyboard...</p>
							{/if}
						</div>
					</div>
				{:else if storyboard}
					<!-- Storyboard Info -->
					<div class="text-base-content/70 mb-6 flex items-center space-x-4 text-sm">
						<div>Created: {new Date(storyboard.createdAt).toLocaleDateString()}</div>
						{#if storyboard.updatedAt !== storyboard.createdAt}
							<div>• Updated: {new Date(storyboard.updatedAt).toLocaleDateString()}</div>
						{/if}
					</div>

					<!-- Visual Slides Horizontal Container -->
					<section aria-labelledby="visual-slides-heading" class="mb-8">
						<h2
							id="visual-slides-heading"
							class="text-base-content mb-6 flex items-center gap-2 text-2xl font-bold"
						>
							<Sparkles class="text-primary h-6 w-6" />
							Slides
						</h2>
						<div class="slides-flex">
							{#each storyboard.visualSlides as slide, index (slide.slideNumber)}
								<SlideThumbnail {storyboard} {slide} {index} on:open={openSlideModal} />
								<button class="btn btn-ghost btn-sm" on:click={() => addNewSlide(index + 1)} aria-label="Add new slide after slide {slide.slideNumber}">
									<PlusCircle class="h-5 w-5" />
								</button>
							{/each}
						</div>
					</section>
					{#if storyboard.status === 'done'}
						<button class="btn btn-primary" onclick={generateGame}>Generate Game</button>
					{/if}
					{#if gameUrl}
						<div class="mt-4">
							<iframe src={gameUrl} title="Game preview" class="h-[600px] w-full border"></iframe>
						</div>
					{/if}
				{/if}
			</div>
		</section>
	</div>
</div>

<!-- Modal for detailed slide view -->
{#if selectedSlideIndex !== null && storyboard}
	<SlideModal
		{storyboard}
		{selectedSlideIndex}
		{progressStoryboard}
		{isNewSlide}
		show={showModal}
		on:close={closeModal}
		on:update={handleStoryboardUpdate}
	/>
{/if}