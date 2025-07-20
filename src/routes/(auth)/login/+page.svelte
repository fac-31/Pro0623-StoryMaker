<script lang="ts">
	import AuthNav from '$lib/components/NavBar/AuthNav.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	export let data: { form?: { error?: string } };
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<AuthNav />

		<!-- Login Form Component -->
		<h1>Sign In</h1>
		<LoginForm error={data?.form?.error ?? ''} />
	</div>
</div>
