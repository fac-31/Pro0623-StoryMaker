<script lang="ts">
	import type { StoryboardOutput } from '$lib/langgraph/storyboardGraph';
	import type { UserPrompt } from '$lib/models/UserPrompt';

	let userPrompt : UserPrompt = {
		numSlides: 6,
		concept: '',
		storyStyle: '',
		targetAudience: '',
		genre: ''
	};

	let feedback = '';
	let storyboard: (StoryboardOutput & { _id?: string }) | null = null;
	let loading = false;
	let error = '';
	let imageUrl = '';
	let logs: string[] = [];

	async function fetchLogs() {
		try {
			const res = await fetch('/api/storyboard/logs');
			if (res.ok) {
				logs = await res.json();
			}
		} catch {
			// intentionally empty
		}
	}

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
				storyboard = data;
				imageUrl = '';
				await fetchLogs();
			} else {
				error = data.error || 'Failed to start storyboard';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function refineSlide() {
		if (!storyboard?._id) return;
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/storyboard/refine', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ _id: storyboard._id, feedback })
			});
			const data = await res.json();
			if (res.ok) {
				storyboard = data;
				imageUrl = '';
				feedback = '';
				await fetchLogs();
			} else {
				error = data.error || 'Failed to refine slide';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function approveSlide() {
		if (!storyboard?._id) return;
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/storyboard/approve', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ _id: storyboard._id })
			});
			const data = await res.json();
			if (res.ok) {
				storyboard = data;
				imageUrl = data.currentSlideDraft?.imageUrl || '';
				await fetchLogs();
			} else {
				error = data.error || 'Failed to approve slide';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function fetchCurrent() {
		if (!storyboard?._id) return;
		loading = true;
		error = '';
		try {
			const res = await fetch(`/api/storyboard/current?_id=${storyboard._id}`);
			const data = await res.json();
			if (res.ok) {
				storyboard = data;
				imageUrl = data.currentSlideDraft?.imageUrl || '';
				await fetchLogs();
			} else {
				error = data.error || 'Failed to fetch storyboard';
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}
</script>

<h1>Storyboard Creator</h1>

{#if !storyboard}
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
<!-- 
{#if storyboard && storyboard.currentSlide !== null}
	<div>
		<h2>Current Slide: {storyboard.currentSlide}</h2>
		<h3>{storyboard.visualSlides?.[storyboard.currentSlide - 1]?.title}</h3>
		<p>
			<strong>Outline:</strong>
			{storyboard.visualSlides?.[storyboard.currentSlide - 1]?.storyOutline}
		</p>
		{#if storyboard.currentSlideDraft}
			<div style="border:1px solid #ccc; padding:1em; margin:1em 0;">
				<p><strong>Scene:</strong> {storyboard.currentSlideDraft.scene}</p>
				<p><strong>Characters:</strong> {storyboard.currentSlideDraft.characters}</p>
				<p><strong>Action:</strong> {storyboard.currentSlideDraft.action}</p>
				<p><strong>Dialogue:</strong> {storyboard.currentSlideDraft.dialogue}</p>
				{#if storyboard.currentSlideDraft.imagePrompt}
					<p><strong>Image Prompt:</strong> {storyboard.currentSlideDraft.imagePrompt}</p>
				{/if}
				{#if imageUrl}
					<img src={imageUrl} alt="Generated" style="max-width:100%; margin-top:1em;" />
				{/if}
			</div>
		{/if}
		<form on:submit|preventDefault={refineSlide}>
			<label for="feedback">Refinement Feedback:</label><br />
			<input
				id="feedback"
				type="text"
				bind:value={feedback}
				placeholder="e.g. Add more action"
				size="40"
			/>
			<button type="submit" disabled={loading || !feedback}>Refine Slide</button>
		</form>
		<button on:click={approveSlide} disabled={loading}>Approve Slide & Generate Image</button>
		<button on:click={fetchCurrent} disabled={loading}>Refresh</button>
		<div style="margin-top:1em;">
			<strong>Slide Progress:</strong>
			{#each storyboard.visualSlides as slide (slide.slideNumber)}
				<span style="margin-right:0.5em;"
					>{slide.slideNumber}{slide.imageGenerated ? '✅' : ''}</span
				>
			{/each}
		</div>
		<button on:click={() => (storyboard = null)} style="margin-top:2em;">Start Over</button>
	</div>
{/if}

{#if logs.length}
	<div
		style="margin-top:2em; background:#222; color:#fff; padding:1em; border-radius:8px; max-height:300px; overflow:auto;"
	>
		<h3>Server Logs</h3>
		<pre>{logs.join('\n')}</pre>
	</div>
{/if} -->

{#if loading}
	<p>Loading...</p>
{/if}
{#if error}
	<p style="color:red;">{error}</p>
{/if}
