<!-- signup form: create a new user account -->
<script lang="ts">
	import { supabase } from '$lib/supabaseBrowserClient';
	import { goto } from '$app/navigation';

	import { navigating } from '$app/state';
	let email = '';
	let password = '';
	let fullName = '';
	let displayName = '';
	let error = '';

	async function submit() {
		const { error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName, display_name: displayName } }
		});
		if (signUpError) {
			error = signUpError.message;
		} else {
			goto('/login');
		}
	}
</script>

<form on:submit|preventDefault={submit}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<input type="text" bind:value={fullName} placeholder="Full Name" required />
	<input type="text" bind:value={displayName} placeholder="Display Name" required />
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
