<script lang="ts">
	import type { StoryboardOutput, StoryboardResponse } from '$lib/langgraph/storyboardGraph';
	import type { UserPrompt } from '$lib/models/UserPrompt';

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

	function openSlideModal(index: number) {
		selectedSlideIndex = index;
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
	<form on:submit|preventDefault={startStoryboard}>
		<div class="form-group">
			<label for="concept">Story Concept:</label><br />
			<textarea
				id="concept"
				bind:value={userPrompt.concept}
				rows="3"
				cols="60"
				placeholder="Enter your story concept..."
				required
			></textarea>
		</div>

		<div class="form-group">
			<label for="numSlides">Number of Slides:</label><br />
			<input
				type="number"
				id="numSlides"
				bind:value={userPrompt.numSlides}
				min="1"
				max="20"
				required
			/>
		</div>

		<div class="form-group">
			<label for="storyStyle">Story Style:</label><br />
			<input
				type="text"
				id="storyStyle"
				bind:value={userPrompt.storyStyle}
				placeholder="e.g., minimalist, detailed, cartoon, realistic..."
				required
			/>
		</div>

		<div class="form-group">
			<label for="targetAudience">Target Audience:</label><br />
			<input
				type="text"
				id="targetAudience"
				bind:value={userPrompt.targetAudience}
				placeholder="e.g., children, teens, adults, professionals..."
				required
			/>
		</div>

		<div class="form-group">
			<label for="genre">Genre:</label><br />
			<input
				type="text"
				id="genre"
				bind:value={userPrompt.genre}
				placeholder="e.g., adventure, comedy, drama, fantasy..."
				required
			/>
		</div>

		<button type="submit" disabled={loading}>Start Storyboard</button>
	</form>
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
				<div
					class="slide-thumbnail"
					on:dblclick={() => openSlideModal(index)}
					role="button"
					tabindex="0"
					on:keydown={(e) => e.key === 'Enter' && openSlideModal(index)}
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
			{/each}
		</div>
	</div>

	<!-- Story Metadata -->
	<div class="metadata-container">
		<h2>Story Details</h2>
		<div class="metadata-grid">
			<div class="metadata-item">
				<strong>Title:</strong>
				{storyboard.storyOutline.storyMetadata.title}
			</div>
			<div class="metadata-item">
				<strong>Genre:</strong>
				{storyboard.storyOutline.storyMetadata.genre}
			</div>
			<div class="metadata-item">
				<strong>Style:</strong>
				{storyboard.storyOutline.storyMetadata.style}
			</div>
			<div class="metadata-item">
				<strong>Target Audience:</strong>
				{storyboard.storyOutline.storyMetadata.targetAudience}
			</div>
			<div class="metadata-item">
				<strong>Total Duration:</strong>
				{storyboard.storyOutline.storyMetadata.totalDuration}
			</div>
		</div>
	</div>

	<!-- Modal for detailed slide view -->
	{#if showModal && selectedSlideIndex !== null}
		{@const slideOutline = storyboard.storyOutline.slideOutlines[selectedSlideIndex]}
		{@const visualSlide = storyboard.visualSlides[selectedSlideIndex]}
		<div
			class="modal-overlay"
			role="button"
			tabindex="0"
			aria-label="Close modal"
			on:click={closeModal}
			on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && closeModal()}
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
{/if}

<style>
	.form-group {
		margin-bottom: 1rem;
	}
</style>
