<script lang="ts">
	let error = '';
	let submitting = false;

	// We'll use a reactive statement or a way to get the error from the page data,
	// but for now, without enhance, you can't intercept errors client-side.
	// Errors must be passed from server via page data or URL params.
</script>

<form method="POST" on:submit={() => (submitting = true)}>
	<input name="email" type="email" placeholder="Email" required />
	<input name="password" type="password" placeholder="Password" required />
	<button type="submit" disabled={submitting}>
		{submitting ? 'Logging in…' : 'Log in'}
	</button>
</form>

{#if error}
	<p style="color: red">{error}</p>
{/if}
