<script lang="ts">
	import { navigating } from '$app/stores';
	import { Check } from 'lucide-svelte';
	import FormField from '$lib/components/common/Form/FormField.svelte';
	export let error: string;
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<form method="POST" class="space-y-6">
			<FormField
				label="Email Address"
				id="email"
				name="email"
				type="email"
				required
				aria-describedby="form-error"
			/>

			<FormField
				label="Password"
				id="password"
				name="password"
				type="password"
				required
				aria-describedby="form-error"
			/>

			{#if error}
				<div id="form-error" class="alert alert-error" role="alert" aria-live="assertive">
					<span>{error}</span>
				</div>
			{/if}

			<button
				type="submit"
				aria-label="Sign In"
				name="sign-in"
				disabled={$navigating.to != null}
				class="btn btn-primary w-full"
			>
				{#if $navigating.to}
					Signing In...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<!-- Benefits -->
		<aside class="mt-8 border-t border-gray-200 pt-6">
			<div class="space-y-3">
				<div class="flex items-center space-x-3">
					<Check class="text-success h-5 w-5" />
					<span class="text-base-content/70 text-sm">Access your storyboards</span>
				</div>
				<div class="flex items-center space-x-3">
					<Check class="text-success h-5 w-5" />
					<span class="text-base-content/70 text-sm">Continue where you left off</span>
				</div>
				<div class="flex items-center space-x-3">
					<Check class="text-success h-5 w-5" />
					<span class="text-base-content/70 text-sm">Sync across devices</span>
				</div>
			</div>
		</aside>
	</div>
</div>

<!-- Sign Up Link -->
<div class="text-center">
	<p class="text-base-content/70">
		Don't have an account?
		<a href="/signup" class="text-primary hover:text-primary-focus font-semibold"> Sign up here </a>
	</p>
</div>
