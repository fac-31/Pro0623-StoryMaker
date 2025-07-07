<script lang="ts">
	import type { UserPrompt } from '$lib/models/UserPrompt';
	import { createEventDispatcher } from 'svelte';

	export let userPrompt: UserPrompt;
	export let loading: boolean = false;

	const dispatch = createEventDispatcher<{
		submit: UserPrompt;
	}>();

	let conceptError = '';
	let numSlidesError = '';
	let storyStyleError = '';
	let targetAudienceError = '';
	let genreError = '';

	function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
		const validity = field.validity;
		let message = '';

		if (!validity.valid) {
			if (validity.valueMissing) {
				message = 'This field is required.';
			} else if (validity.typeMismatch) {
				message = 'Please enter a valid value.';
			} else if (validity.rangeUnderflow) {
				message = `Value must be at least ${'min' in field ? field.min : ''}.`;
			} else if (validity.rangeOverflow) {
				message = `Value must be no more than ${'max' in field ? field.max : ''}.`;
			} else {
				message = 'The value you entered is not valid.';
			}
		}

		const id = field.id;
		if (id === 'concept') conceptError = message;
		else if (id === 'numSlides') numSlidesError = message;
		else if (id === 'storyStyle') storyStyleError = message;
		else if (id === 'targetAudience') targetAudienceError = message;
		else if (id === 'genre') genreError = message;
	}

	function handleSubmit() {
		// Manually trigger validation for all fields to update error states
		const fieldsToValidate = document.querySelectorAll(
			'#concept, #numSlides, #storyStyle, #targetAudience, #genre'
		);
		fieldsToValidate.forEach((field) => {
			validateField(field as HTMLInputElement | HTMLTextAreaElement);
		});

		// Check if any error messages were set
		if (conceptError || numSlidesError || storyStyleError || targetAudienceError || genreError) {
			const firstInvalidField = document.querySelector('[aria-invalid="true"]');
			if (firstInvalidField) {
				(firstInvalidField as HTMLElement).focus();
			}
			return; // Prevent dispatch if errors exist
		}
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
			aria-invalid={conceptError !== ''}
			on:blur={(e) => validateField(e.target as HTMLInputElement | HTMLTextAreaElement)}
			class="focus:ring-2 focus:outline-none"
		></textarea>
		<span id="concept-description" class="sr-only"
			>Clearly outline the main idea or plot of your story.</span
		>
		<span id="concept-error" class="error-message" role="alert">{conceptError}</span>
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
			aria-invalid={numSlidesError !== ''}
			on:blur={(e) => validateField(e.target as HTMLInputElement | HTMLTextAreaElement)}
			class="focus:ring-2 focus:outline-none"
		/>
		<span id="numSlides-description" class="sr-only">Enter a number between 1 and 20.</span>
		<span id="numSlides-error" class="error-message" role="alert">{numSlidesError}</span>
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
			aria-invalid={storyStyleError !== ''}
			on:blur={(e) => validateField(e.target as HTMLInputElement | HTMLTextAreaElement)}
			class="focus:ring-2 focus:outline-none"
		/>
		<span id="storyStyle-description" class="sr-only"
			>Describe the visual style of the storyboard (e.g., minimalist, detailed, cartoon, realistic).</span
		>
		<span id="storyStyle-error" class="error-message" role="alert">{storyStyleError}</span>
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
			aria-invalid={targetAudienceError !== ''}
			on:blur={(e) => validateField(e.target as HTMLInputElement | HTMLTextAreaElement)}
			class="focus:ring-2 focus:outline-none"
		/>
		<span id="targetAudience-description" class="sr-only"
			>Specify the intended audience for this story (e.g., children, teens, adults, professionals).</span
		>
		<span id="targetAudience-error" class="error-message" role="alert">{targetAudienceError}</span>
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
			aria-invalid={genreError !== ''}
			on:blur={(e) => validateField(e.target as HTMLInputElement | HTMLTextAreaElement)}
			class="focus:ring-2 focus:outline-none"
		/>
		<span id="genre-description" class="sr-only"
			>Define the genre of the story (e.g., adventure, comedy, drama, fantasy).</span
		>
		<span id="genre-error" class="error-message" role="alert">{genreError}</span>
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
