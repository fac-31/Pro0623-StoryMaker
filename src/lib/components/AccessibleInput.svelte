<script lang="ts">
	import { onMount } from 'svelte';

	export let id: string;
	export let label: string;
	export let value: string;
	export let error: string | undefined = undefined;

	let inputElement: HTMLInputElement;

	onMount(() => {
		if (inputElement) {
			inputElement.setAttribute('aria-describedby', `${id}-error`);
		}
	});
</script>

<div>
	<label for={id}>{label}</label>
	<input bind:this={inputElement} {id} type="text" bind:value />
	{#if error}
		<p id={`${id}-error`} class="error" aria-live="assertive">{error}</p>
	{/if}
</div>

<style>
	.error {
		color: red;
	}
</style>
