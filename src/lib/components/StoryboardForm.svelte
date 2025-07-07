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
			aria-describedby="concept-description"
			aria-errormessage="concept-error"
			aria-invalid="false"
			class="focus:ring-2 focus:outline-none"
		></textarea>
		<span
			id="concept-description"
			style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0;"
			>Clearly outline the main idea or plot of your story.</span
		>
		<span id="concept-error" class="error-message" role="alert"></span>
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
			aria-describedby="numSlides-description"
			aria-errormessage="numSlides-error"
			aria-invalid="false"
			class="focus:ring-2 focus:outline-none"
		/>
		<span
			id="numSlides-description"
			style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0;"
			>Enter a number between 1 and 20.</span
		>
		<span id="numSlides-error" class="error-message" role="alert"></span>
	</div>

	<div class="form-group">
		<label for="storyStyle">Story Style:</label><br />
		<input
			type="text"
			id="storyStyle"
			bind:value={userPrompt.storyStyle}
			placeholder="e.g., minimalist, detailed, cartoon, realistic..."
			required
			aria-describedby="storyStyle-description"
			aria-errormessage="storyStyle-error"
			aria-invalid="false"
			class="focus:ring-2 focus:outline-none"
		/>
		<span
			id="storyStyle-description"
			style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0;"
			>Describe the visual style of the storyboard (e.g., minimalist, detailed, cartoon, realistic).</span
		>
		<span id="storyStyle-error" class="error-message" role="alert"></span>
	</div>

	<div class="form-group">
		<label for="targetAudience">Target Audience:</label><br />
		<input
			type="text"
			id="targetAudience"
			bind:value={userPrompt.targetAudience}
			placeholder="e.g., children, teens, adults, professionals..."
			required
			aria-describedby="targetAudience-description"
			aria-errormessage="targetAudience-error"
			aria-invalid="false"
			class="focus:ring-2 focus:outline-none"
		/>
		<span
			id="targetAudience-description"
			style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0;"
			>Specify the intended audience for this story (e.g., children, teens, adults, professionals).</span
		>
		<span id="targetAudience-error" class="error-message" role="alert"></span>
	</div>

	<div class="form-group">
		<label for="genre">Genre:</label><br />
		<input
			type="text"
			id="genre"
			bind:value={userPrompt.genre}
			placeholder="e.g., adventure, comedy, drama, fantasy..."
			required
			aria-describedby="genre-description"
			aria-errormessage="genre-error"
			aria-invalid="false"
			class="focus:ring-2 focus:outline-none"
		/>
		<span
			id="genre-description"
			style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0;"
			>Define the genre of the story (e.g., adventure, comedy, drama, fantasy).</span
		>
		<span id="genre-error" class="error-message" role="alert"></span>
	</div>

	<button type="submit" disabled={loading} class="focus:ring-2 focus:outline-none"
		>Start Storyboard</button
	>

	<div role="status" aria-live="polite">
		{#if loading}
			<p>Submitting form...</p>
		{/if}
	</div>
</form>
