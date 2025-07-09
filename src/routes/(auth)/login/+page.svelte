<script lang="ts">
  import AuthNav from '$lib/components/NavBar/AuthNav.svelte';
  import LoginForm from '$lib/components/LoginForm.svelte';
  export let data: { form?: { error?: string } };
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md space-y-8">
    <!-- Header -->
    <AuthNav/>

    <!-- Login Form Component -->
    <LoginForm error={data?.form?.error ?? ''}/>
	</div>
</div>
