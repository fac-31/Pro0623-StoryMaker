<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let showModal: boolean;
	export let close: () => void;

	let modal: HTMLElement;
	let lastFocus: HTMLElement | null = null;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close();
			return;
		}

		if (event.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll(
				'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
			);
			const first = nodes[0] as HTMLElement;
			const last = nodes[nodes.length - 1] as HTMLElement;

			if (event.shiftKey && document.activeElement === first) {
				last.focus();
				event.preventDefault();
			} else if (!event.shiftKey && document.activeElement === last) {
				first.focus();
				event.preventDefault();
			}
		}
	}

	onMount(() => {
		lastFocus = document.activeElement as HTMLElement;
		const firstFocusable = modal.querySelector(
			'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		) as HTMLElement | null;
		if (firstFocusable) {
			firstFocusable.focus();
		}
	});

	onDestroy(() => {
		if (lastFocus) {
			lastFocus.focus();
		}
	});
</script>

{#if showModal}
	<div bind:this={modal} class="modal-overlay" on:keydown={handleKeydown}>
		<div class="modal-content" role="dialog" aria-modal="true">
			<slot />
			<button on:click={close}>Close</button>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
	}
</style>
