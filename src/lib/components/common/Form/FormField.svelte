<script lang="ts">
	import { fade } from 'svelte/transition';

	export let label: string;
	export let id: string;
	export let type: string = 'text';
	export let required: boolean = false;
	export let value: string | number;
	export let placeholder: string = '';
	export let error: string | null = null;
</script>

<div class="form-control">
	<label class="label" for={id}>
		<span class="label-text">{label}</span>
	</label>
	<input {id} {type} {required} {placeholder} bind:value class="input input-bordered w-full" />
	{#if error}
		<div
			class="alert alert-error mt-2"
			role="alert"
			aria-live="assertive"
			id="{id}-error"
			transition:fade
		>
			<span>{error}</span>
		</div>
	{/if}
</div>
