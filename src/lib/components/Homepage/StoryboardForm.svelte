<script lang='ts'>
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

<form
	on:submit|preventDefault={handleSubmit}
	class='bg-base-100 mx-auto max-w-2xl space-y-6 rounded-lg border p-6 shadow-sm'
	aria-label='Storyboard creation form'
>
	<div class='form-control'>
		<label for='concept' class='label'>
			<span class='label-text'>Story Concept:</span>
		</label>
		<textarea
			id='concept'
			class='textarea textarea-bordered'
			bind:value={userPrompt.concept}
			rows='3'
			placeholder='Enter your story concept...'
			required
		></textarea>
	</div>

	<div class='form-control'>
		<label for='numSlides' class='label'>
			<span class='label-text'>Number of Slides:</span>
		</label>
		<input
			type='number'
			id='numSlides'
			class='input input-bordered max-w-xs'
			bind:value={userPrompt.numSlides}
			min='1'
			max='20'
			required
		/>
	</div>

	<div class='form-control'>
		<label for='storyStyle' class='label'>
			<span class='label-text'>Story Style:</span>
		</label>
		<input
			type='text'
			id='storyStyle'
			class='input input-bordered'
			bind:value={userPrompt.storyStyle}
			placeholder='e.g., minimalist, detailed, cartoon, realistic...'
			required
		/>
	</div>

	<div class='form-control'>
		<label for='targetAudience' class='label'>
			<span class='label-text'>Target Audience:</span>
		</label>
		<input
			type='text'
			id='targetAudience'
			class='input input-bordered'
			bind:value={userPrompt.targetAudience}
			placeholder='e.g., children, teens, adults, professionals...'
			required
		/>
	</div>

	<div class='form-control'>
		<label for='genre' class='label'>
			<span class='label-text'>Genre:</span>
		</label>
		<input
			type='text'
			id='genre'
			class='input input-bordered'
			bind:value={userPrompt.genre}
			placeholder='e.g., adventure, comedy, drama, fantasy...'
			required
		/>
	</div>

	<button type='submit' class='btn btn-primary w-full text-lg' disabled={loading}>
		{loading ? 'Loading...' : 'Start Storyboard'}
	</button>
</form>
