<script lang="ts">
	let error = '';
	let submitting = false;
	export let form;
</script>

<form method="POST" on:submit={() => (submitting = true)}>
	<input name="email" type="email" placeholder="Email" required />
	<input name="password" type="password" placeholder="Password" required />
	<button type="submit" disabled={submitting}>
		{submitting ? 'Logging in…' : 'Log in'}
	</button>
</form>

{#if form?.error}
	<p style="color: red">{form.error}</p>
{/if}
