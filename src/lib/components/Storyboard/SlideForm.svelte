<script lang="ts">
	/**
	 * @file A form for editing the details of a single storyboard slide.
	 */
	import type { SlideOutline, Character, SlideDialogue } from '$lib/models/story';

	/** The slide outline object to be edited. */
	export let editableSlideOutline: SlideOutline;

	/** Controls whether the form fields are in an editable state. */
	export let editing: boolean;

	/** Adds a new, empty character object to the characters array. */
	function addCharacter() {
		const newCharacter: Character = {
			name: 'New Character',
			role: 'supporting',
			description: '',
			emotions: [],
			position: 'center'
		};
		editableSlideOutline.characters = [...editableSlideOutline.characters, newCharacter];
	}

	/** Adds a new, empty dialogue object to the dialogue array. */
	function addDialogue() {
		const newDialogue: SlideDialogue = {
			character: '',
			line: ''
		};
		editableSlideOutline.text.dialogue = [...editableSlideOutline.text.dialogue, newDialogue];
	}
</script>

<div class="detail-section">
	<h4>Scene</h4>
	{#if editing}
		<p>
			<strong>Title:</strong> <input class="w-full" bind:value={editableSlideOutline.sceneTitle} />
		</p>
		<p>
			<strong>Duration:</strong>
			<input class="w-full" type="number" bind:value={editableSlideOutline.durationSeconds} />s
		</p>
		<p>
			<strong>Timestamp:</strong>
			<input class="w-full" bind:value={editableSlideOutline.timestamp} />
		</p>
	{:else}
		<p><strong>Title:</strong> {editableSlideOutline.sceneTitle}</p>
		<p><strong>Duration:</strong> {editableSlideOutline.durationSeconds}s</p>
		<p><strong>Timestamp:</strong> {editableSlideOutline.timestamp}</p>
	{/if}
</div>

<div class="detail-section">
	<h4>Description</h4>
	{#if editing}
		<textarea class="w-full" bind:value={editableSlideOutline.sceneDescription}></textarea>
	{:else}
		<p>{editableSlideOutline.sceneDescription}</p>
	{/if}
</div>

<div class="detail-section">
	<h4>Visual Style</h4>
	{#if editing}
		<input class="w-full" bind:value={editableSlideOutline.visualStyle} />
		<p>
			<strong>Camera:</strong>
			<input class="w-full" bind:value={editableSlideOutline.cameraAngle} />
		</p>
	{:else}
		<p>{editableSlideOutline.visualStyle}</p>
		<p><strong>Camera:</strong> {editableSlideOutline.cameraAngle}</p>
	{/if}
</div>

<div class="detail-section">
	<h4>Characters</h4>
	{#if editableSlideOutline.characters.length === 0}
		<p>No characters in this slide.</p>
	{/if}
	{#each editableSlideOutline.characters as character (character)}
		<div class="character-info">
			{#if editing}
				<div>
					<strong>Name:</strong>
					<input class="w-full" bind:value={character.name} />
				</div>
				<div>
					<strong>Role:</strong>
					<input class="w-full" bind:value={character.role} />
				</div>
				<div>
					<strong>Description:</strong>
					<textarea class="w-full" bind:value={character.description}></textarea>
				</div>
				<div>
					<small
						><strong>Position:</strong>
						<input class="w-full" bind:value={character.position} /></small
					>
				</div>
				<div class="emotions">
					<strong>Emotions:</strong>
					<input class="w-full" bind:value={character.emotions} />
				</div>
			{:else}
				<strong>{character.name}</strong> ({character.role})
				<p>{character.description}</p>
				<small>Position: {character.position}</small>
				{#if character.emotions.length > 0}
					<div class="emotions">Emotions: {character.emotions.join(', ')}</div>
				{/if}
			{/if}
		</div>
	{/each}
	{#if editing}
		<button class="btn btn-sm btn-primary" on:click={addCharacter}>Add Character</button>
	{/if}
</div>

<div class="detail-section">
	<h4>Dialogue</h4>
	{#if editableSlideOutline.text.dialogue.length === 0}
		<p>No dialogue in this slide.</p>
	{/if}
	{#each editableSlideOutline.text.dialogue as dialogue (dialogue)}
		<div class="dialogue-line">
			{#if editing}
				<div>
					<strong>Character:</strong>
					<br />
					<input class="w-full" bind:value={dialogue.character} />
				</div>
				<div>
					<strong>Line:</strong>
					<br />
					<input class="w-full" bind:value={dialogue.line} />
				</div>
			{:else}
				<strong>{dialogue.character}:</strong> "{dialogue.line}"
			{/if}
		</div>
	{/each}
	{#if editing}
		<button class="btn btn-sm btn-primary" on:click={addDialogue}>Add Dialogue</button>
	{/if}
</div>
