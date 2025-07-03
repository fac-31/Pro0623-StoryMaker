<script lang="ts">
	import type { UserPrompt } from '$lib/models/UserPrompt';
	import { createEventDispatcher } from 'svelte';

	export let userPrompt: UserPrompt;
	export let loading: boolean = false;

	const dispatch = createEventDispatcher<{
		submit: UserPrompt;
	}>();

	function handleSubmit() {
		dispatch('submit', userPrompt);
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
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
