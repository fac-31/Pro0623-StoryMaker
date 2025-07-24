<script lang="ts">
	import AccessibleInput from '$lib/components/AccessibleInput.svelte';

	let name = '';
	let email = '';
	let message = '';

	let nameError: string | undefined = undefined;
	let emailError: string | undefined = undefined;

	function validate() {
		nameError = name ? undefined : 'Name is required';
		emailError = email && /.+@.+\..+/.test(email) ? undefined : 'Email is invalid';
	}

	function handleSubmit() {
		validate();
		if (!nameError && !emailError) {
			alert('Form submitted!');
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<h1>Contact Us</h1>
	<AccessibleInput id="name" label="Name" bind:value={name} error={nameError} />
	<AccessibleInput id="email" label="Email" bind:value={email} error={emailError} />
	<div>
		<label for="message">Message</label>
		<textarea id="message" bind:value={message} />
	</div>
	<button type="submit">Submit</button>
</form>
