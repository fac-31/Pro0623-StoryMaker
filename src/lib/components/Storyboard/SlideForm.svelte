<script lang="ts">
	import type { SlideOutline, Character, SlideDialogue } from '$lib/models/story';

	export let editableSlideOutline: SlideOutline;
	export let editing: boolean;

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
			<strong>Title:</strong> <input bind:value={editableSlideOutline.sceneTitle} />
		</p>
		<p>
			<strong>Duration:</strong>
			<input type="number" bind:value={editableSlideOutline.durationSeconds} />s
		</p>
		<p>
			<strong>Timestamp:</strong>
			<input bind:value={editableSlideOutline.timestamp} />
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
		<textarea bind:value={editableSlideOutline.sceneDescription}></textarea>
	{:else}
		<p>{editableSlideOutline.sceneDescription}</p>
	{/if}
</div>

<div class="detail-section">
	<h4>Visual Style</h4>
	{#if editing}
		<input bind:value={editableSlideOutline.visualStyle} />
		<p>
			<strong>Camera:</strong> <input bind:value={editableSlideOutline.cameraAngle} />
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
	{#each editableSlideOutline.characters as character (editableSlideOutline.slideId + character.name)}
		<div class="character-info">
			{#if editing}
				<strong>Name:</strong>
				<input bind:value={character.name} />
				<strong>Role:</strong>
				<input bind:value={character.role} />
				<p>
					<strong>Description:</strong>
					<textarea bind:value={character.description}></textarea>
				</p>
				<small><strong>Position:</strong> <input bind:value={character.position} /></small>
				{#if character.emotions.length > 0}
					<div class="emotions">
						<strong>Emotions:</strong>
						<input bind:value={character.emotions} />
					</div>
				{/if}
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
	{#each editableSlideOutline.text.dialogue as dialogue (editableSlideOutline.slideId + dialogue.line)}
		<div class="dialogue-line">
			{#if editing}
				<strong>Character:</strong>
				<input bind:value={dialogue.character} />
				<strong>Line:</strong>
				<input bind:value={dialogue.line} />
			{:else}
				<strong>{dialogue.character}:</strong> "{dialogue.line}"
			{/if}
		</div>
	{/each}
	{#if editing}
		<button class="btn btn-sm btn-primary" on:click={addDialogue}>Add Dialogue</button>
	{/if}
</div>
