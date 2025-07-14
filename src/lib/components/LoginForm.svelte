<script lang="ts">
	import { navigating } from '$app/state';
	import { Check } from 'lucide-svelte';
	export let error: string;
</script>

<div class="rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
	<form method="POST" class="space-y-6">
		<div>
			<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
				Email Address
			</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
			/>
		</div>

		<div>
			<label for="password" class="mb-2 block text-sm font-medium text-gray-700"> Password </label>
			<input
				id="password"
				name="password"
				type="password"
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
			aria-label="Sign In"
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
		<a href="/signup" class="font-semibold text-purple-600 transition-colors hover:text-purple-700">
			Sign up here
		</a>
	</p>
</div>
