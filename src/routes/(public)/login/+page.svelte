<!-- login form -->
<script lang="ts">
	import { supabase } from '$lib/supabaseBrowserClient';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';

	let email = '',
		password = '',
		error = '';

	async function submit() {
		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (authError) {
			error = authError.message;
		} else {
			goto('/');
		}
	}
</script>

<form on:submit|preventDefault={submit}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<button type="submit" disabled={navigating.to != null}>
		{#if navigating.to}
			Logging in…
		{:else}
			Log in
		{/if}
	</button>
	{#if error}<p style="color: red">{error}</p>{/if}
</form>
