<script lang="ts">
	import type { Storyboard } from '$lib/models/storyboard.model';
	import type { UserPrompt } from '$lib/models/UserPrompt';
	import StoryboardForm from '$lib/components/StoryboardForm.svelte';
	import SlideThumbnail from '$lib/components/SlideThumbnail.svelte';
	import MetadataContainer from '$lib/components/MetadataContainer.svelte';
	import SlideModal from '$lib/components/SlideModal.svelte';
	import {
		Play,
		Video,
		Loader2,
		Pause,
		SkipBack,
		SkipForward,
		ArrowLeft,
		Sparkles
	} from 'lucide-svelte';

	let userPrompt: UserPrompt = {
		numSlides: 6,
		concept: '',
		storyStyle: '',
		targetAudience: '',
		genre: ''
	};

	let storyboard: Storyboard | null = null;
	let loading = false;
	let error = '';
	let selectedSlideIndex: number | null = null;
	let showModal = false;

	// Video generation state
	let generatingVideo = false;
	let videoError = '';

	// Slideshow player state
	let currentSlideIndex = 0;
	let isPlaying = false;
	let audioSegments: Array<{
		slideNumber: number;
		audioUrl: string;
		duration: number;
		dialogue: string;
	}> = [];
	let slides: Array<{
		slideNumber: number;
		imageUrl: string;
		sceneTitle: string;
	}> = [];
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let storyMetadata: Record<string, unknown> | null = null;
	let showPlayer = false;

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
				const id = data.insertedId;
				console.log(id);

				await progressStoryboard(id);

				//storyboard = storyBoardResponse.storyboardOutput;
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

	async function progressStoryboard(id: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const source = new EventSource('/api/storyboard/progress/' + id);

			source.onmessage = (event) => {
				storyboard = JSON.parse(event.data);

				if (storyboard && storyboard.status == 'done') {
					source.close();
					resolve();
				}
			};

			source.onerror = (err) => {
				console.error('SSE connection error', err);
				source.close();
				reject(new Error('SSE connection error'));
			};
		});
	}

	async function generateVideo() {
		if (!storyboard) return;

		generatingVideo = true;
		videoError = '';
		showPlayer = false;

		try {
			const res = await fetch('/api/storyboard/generate-video', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					storyboard: storyboard,
					storyboardId: storyboard._id
				})
			});

			const data = await res.json();
			if (res.ok && data.success) {
				audioSegments = data.audioSegments;
				slides = data.slides;
				storyMetadata = data.storyMetadata;
				showPlayer = true;
				currentSlideIndex = 0;
				isPlaying = false;
			} else {
				videoError = data.error || 'Failed to generate audio';
			}
		} catch (e) {
			videoError = e instanceof Error ? e.message : String(e);
		} finally {
			generatingVideo = false;
		}
	}

	function togglePlay() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			playNextSlide();
		}
	}

	function playNextSlide() {
		if (!isPlaying || currentSlideIndex >= slides.length - 1) {
			isPlaying = false;
			return;
		}

		const currentSegment = audioSegments[currentSlideIndex];
		if (currentSegment && currentSegment.audioUrl) {
			const audio = new Audio(currentSegment.audioUrl);
			audio.play();

			// Wait for audio duration or minimum duration
			const duration = Math.max(currentSegment.duration * 1000, 2000);
			setTimeout(() => {
				if (isPlaying) {
					currentSlideIndex++;
					playNextSlide();
				}
			}, duration);
		} else {
			// No audio, just wait minimum duration
			setTimeout(() => {
				if (isPlaying) {
					currentSlideIndex++;
					playNextSlide();
				}
			}, 3000);
		}
	}

	function goToSlide(index: number) {
		currentSlideIndex = Math.max(0, Math.min(index, slides.length - 1));
		isPlaying = false;
	}

	function previousSlide() {
		goToSlide(currentSlideIndex - 1);
	}

	function nextSlide() {
		goToSlide(currentSlideIndex + 1);
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

<main
	class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="mx-auto max-w-6xl space-y-8">
		<!-- Header -->
		<div class="text-center">
			<a
				href="/"
				class="mb-8 inline-flex items-center space-x-2 text-purple-600 transition-colors hover:text-purple-700 motion-reduce:transition-none"
			>
				<ArrowLeft class="h-5 w-5" />
				<span>Back to Home</span>
			</a>

			<div class="mb-6 flex justify-center">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<Play class="h-6 w-6 text-white" />
				</div>
			</div>

			<h1 class="mb-2 text-3xl font-bold text-gray-900">Storyboard Creator</h1>
			<p class="text-gray-600">
				Transform your story ideas into visual magic with AI-powered generation
			</p>
		</div>

		<!-- Main Content -->
		<section
			aria-label="Storyboard creation and display"
			class="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm"
		>
			{#if !storyboard && !loading}
				<StoryboardForm bind:userPrompt {loading} on:submit={handleFormSubmit} />
			{/if}

			{#if loading}
				<div class="flex items-center justify-center py-12">
					<div class="text-center">
						<Loader2
							class="mx-auto h-8 w-8 animate-spin text-purple-600 motion-reduce:animate-none"
						/>
						<p class="mt-4 text-gray-600">Creating your storyboard...</p>
					</div>
				</div>
			{/if}

			{#if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<p class="text-sm text-red-600">{error}</p>
				</div>
			{/if}

			{#if storyboard}
				<!-- Action Buttons -->
				<div class="mb-8 flex flex-col gap-4 sm:flex-row">
					<button
						onclick={generateVideo}
						disabled={generatingVideo}
						class="flex transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none"
					>
						{#if generatingVideo}
							<Loader2 class="h-5 w-5 animate-spin motion-reduce:animate-none" />
							<span>Generating Audio...</span>
						{:else}
							<Video class="h-5 w-5" />
							<span>Play Storyboard</span>
						{/if}
					</button>
				</div>

				<!-- Slideshow Player -->
				{#if showPlayer && slides.length > 0}
					<section
						aria-labelledby="player-heading"
						class="mb-8 rounded-xl border border-gray-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm"
					>
						<h3
							id="player-heading"
							class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900"
						>
							<Play class="h-5 w-5 text-purple-600" />
							Storyboard Player
						</h3>

						<!-- Current Slide Display -->
						<div class="mb-6">
							<div class="relative mx-auto max-w-4xl">
								<img
									src={slides[currentSlideIndex].imageUrl}
									alt={`Slide ${slides[currentSlideIndex].slideNumber}`}
									class="h-auto w-full rounded-lg shadow-md"
								/>
								<div class="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-1 text-white">
									Slide {slides[currentSlideIndex].slideNumber} of {slides.length}
								</div>
							</div>

							{#if audioSegments[currentSlideIndex]?.dialogue}
								<div class="mt-4 rounded-lg bg-gray-50 p-4">
									<h4 class="mb-2 font-semibold text-gray-800">Dialogue:</h4>
									<p class="text-gray-600">{audioSegments[currentSlideIndex].dialogue}</p>
								</div>
							{/if}
						</div>

						<!-- Player Controls -->
						<div class="flex items-center justify-center space-x-4">
							<button
								onclick={previousSlide}
								disabled={currentSlideIndex === 0}
								class="flex items-center justify-center rounded-full bg-gray-200 p-3 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
							>
								<SkipBack class="h-5 w-5" />
							</button>

							<button
								onclick={togglePlay}
								class="flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white transition-all hover:from-purple-700 hover:to-blue-700 motion-reduce:transition-none"
							>
								{#if isPlaying}
									<Pause class="h-6 w-6" />
								{:else}
									<Play class="h-6 w-6" />
								{/if}
							</button>

							<button
								onclick={nextSlide}
								disabled={currentSlideIndex === slides.length - 1}
								class="flex items-center justify-center rounded-full bg-gray-200 p-3 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
							>
								<SkipForward class="h-5 w-5" />
							</button>
						</div>

						<!-- Slide Navigation -->
						<div class="mt-6 flex flex-wrap justify-center space-x-2">
							{#each slides as slide, index (slide.slideNumber)}
								<button
									onclick={() => goToSlide(index)}
									class="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors {currentSlideIndex ===
									index
										? 'bg-purple-600 text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'} motion-reduce:transition-none"
								>
									{index + 1}
								</button>
							{/each}
						</div>
					</section>
				{/if}

				{#if videoError}
					<div class="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
						<p class="text-red-600">Audio generation failed: {videoError}</p>
					</div>
				{/if}

				<!-- Visual Slides Horizontal Container -->
				<section aria-labelledby="visual-slides-heading" class="mb-8">
					<h2
						id="visual-slides-heading"
						class="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900"
					>
						<Sparkles class="h-6 w-6 text-purple-600" />
						Visual Slides
					</h2>
					<div class="slides-flex">
						{#each storyboard.visualSlides as slide, index (slide.slideNumber)}
							<SlideThumbnail {slide} {index} on:open={openSlideModal} />
						{/each}
					</div>
				</section>

				<!-- Story Metadata -->
				<section aria-label="Story Metadata">
					<MetadataContainer {storyboard} />
				</section>
			{/if}
		</section>
	</div>
</main>

<!-- Modal for detailed slide view -->
{#if selectedSlideIndex !== null && storyboard}
	<SlideModal {storyboard} {selectedSlideIndex} show={showModal} on:close={closeModal} />
{/if}
