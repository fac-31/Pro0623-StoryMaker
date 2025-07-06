<!-- signup form: create a new user account -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { Play, ArrowLeft, Check } from 'lucide-svelte';

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

			<h2 class="mb-2 text-3xl font-bold text-gray-900">Create Your Account</h2>
			<p class="text-gray-600">Join thousands of creators using StoryMaker</p>
		</div>

		<!-- Form -->
		<div class="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
			<form on:submit|preventDefault={submit} class="space-y-6">
				<div>
					<label for="full_name" class="mb-2 block text-sm font-medium text-gray-700">
						Full Name
					</label>
					<input
						id="full_name"
						type="text"
						bind:value={full_name}
						placeholder="Enter your full name"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
					/>
				</div>

				<div>
					<label for="display_name" class="mb-2 block text-sm font-medium text-gray-700">
						Display Name
					</label>
					<input
						id="display_name"
						type="text"
						bind:value={display_name}
						placeholder="Choose a display name"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
					/>
				</div>

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
						placeholder="Create a password"
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
						Creating Account...
					{:else}
						Create Account
					{/if}
				</button>
			</form>

			<!-- Benefits -->
			<div class="mt-8 border-t border-gray-200 pt-6">
				<div class="space-y-3">
					<div class="flex items-center space-x-3">
						<Check class="h-5 w-5 text-green-500" />
						<span class="text-sm text-gray-600">Free forever plan available</span>
					</div>
					<div class="flex items-center space-x-3">
						<Check class="h-5 w-5 text-green-500" />
						<span class="text-sm text-gray-600">No credit card required</span>
					</div>
					<div class="flex items-center space-x-3">
						<Check class="h-5 w-5 text-green-500" />
						<span class="text-sm text-gray-600">Access to all basic features</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Sign In Link -->
		<div class="text-center">
			<p class="text-gray-600">
				Already have an account?
				<a
					href="/login"
					class="font-semibold text-purple-600 transition-colors hover:text-purple-700"
				>
					Sign in here
				</a>
			</p>
		</div>
	</div>
</div>
