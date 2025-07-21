<script lang="ts">
	import type { UserPrompt } from '$lib/models/UserPrompt';
	import { createEventDispatcher } from 'svelte';
	import FormField from '$lib/components/common/Form/FormField.svelte';

	export let userPrompt: UserPrompt;
	export let loading: boolean = false;

	const dispatch = createEventDispatcher<{
		submit: UserPrompt;
	}>();

	function handleSubmit() {
		dispatch('submit', userPrompt);
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	class="bg-base-100 mx-auto max-w-2xl space-y-6 rounded-lg border p-6 shadow-sm"
>
	<FormField
		label="Story Concept:"
		id="concept"
		type="textarea"
		bind:value={userPrompt.concept}
		placeholder="Enter your story concept..."
		required
	/>

	<FormField
		label="Number of Slides:"
		id="numSlides"
		type="number"
		bind:value={userPrompt.numSlides}
		min="1"
		max="20"
		required
	/>

	<FormField
		label="Story Style:"
		id="storyStyle"
		type="text"
		bind:value={userPrompt.storyStyle}
		placeholder="e.g., minimalist, detailed, cartoon, realistic..."
		required
	/>

	<FormField
		label="Target Audience:"
		id="targetAudience"
		type="text"
		bind:value={userPrompt.targetAudience}
		placeholder="e.g., children, teens, adults, professionals..."
		required
	/>

	<FormField
		label="Genre:"
		id="genre"
		type="text"
		bind:value={userPrompt.genre}
		placeholder="e.g., adventure, comedy, drama, fantasy..."
		required
	/>

	<button type="submit" class="btn btn-primary w-full text-lg" disabled={loading}>
		{loading ? 'Loading...' : 'Start Storyboard'}
	</button>
</form>
