<!-- signup form: create a new user account -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';

	let email = '';
	let password = '';
	let full_name = '';
	let display_name = '';
	let error = '';

	async function submit() {
		const res = await fetch('/api/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email,
				password,
				full_name,
				display_name
			})
		});

		const result = await res.json();
		if (result.error) {
			error = result.error;
			return;
		}

		goto('/login');
	}
</script>

<form on:submit|preventDefault={submit}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<input type="text" bind:value={full_name} placeholder="Full Name" required />
	<input type="text" bind:value={display_name} placeholder="Display Name" required />
	<button type="submit" disabled={navigating.to != null}>
		{#if navigating.to}
			Signing up…
		{:else}
			Sign up
		{/if}
	</button>
	{#if error}
		<p style="color: red">{error}</p>
	{/if}
</form>
