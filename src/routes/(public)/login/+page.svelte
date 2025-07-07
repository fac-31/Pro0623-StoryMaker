<script lang="ts">
	import { supabase } from '$lib/supabaseBrowserClient';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { Play, ArrowLeft, Check } from 'lucide-svelte';

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

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<div class="text-center">
			<a
				href="/"
				class="mb-8 inline-flex items-center space-x-2 text-purple-600 transition-colors hover:text-purple-700"
			>
				<ArrowLeft class="h-5 w-5" />
				<span>Back to Home</span>
			</a>

			<div class="mb-6 flex justify-center">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600"
				>
					<Play class="h-6 w-6 text-white" />
				</div>
			</div>

			<h2 class="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
			<p class="text-gray-600">Sign in to continue creating amazing storyboards</p>
		</div>

		<!-- Form -->
		<div class="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
			<form on:submit|preventDefault={submit} class="space-y-6">
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
					/>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Enter your password"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
					/>
				</div>

				{#if error}
					<div class="rounded-lg border border-red-200 bg-red-50 p-4">
						<p class="text-sm text-red-600">{error}</p>
					</div>
				{/if}

				<button
					type="submit"
					disabled={navigating.to != null}
					class="w-full transform rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if navigating.to}
						Signing In...
					{:else}
						Sign In
					{/if}
				</button>
			</form>

			<!-- Benefits -->
			<div class="mt-8 border-t border-gray-200 pt-6">
				<div class="space-y-3">
					<div class="flex items-center space-x-3">
						<Check class="h-5 w-5 text-green-500" />
						<span class="text-sm text-gray-600">Access your storyboards</span>
					</div>
					<div class="flex items-center space-x-3">
						<Check class="h-5 w-5 text-green-500" />
						<span class="text-sm text-gray-600">Continue where you left off</span>
					</div>
					<div class="flex items-center space-x-3">
						<Check class="h-5 w-5 text-green-500" />
						<span class="text-sm text-gray-600">Sync across devices</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Sign Up Link -->
		<div class="text-center">
			<p class="text-gray-600">
				Don't have an account?
				<a
					href="/signup"
					class="font-semibold text-purple-600 transition-colors hover:text-purple-700"
				>
					Sign up here
				</a>
			</p>
		</div>
	</div>
</div>
