<script lang="ts">
	import { navigating } from '$app/state';
	import { Check } from 'lucide-svelte';
	export let error: string;
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<form method="POST" class="space-y-6">
			<div class="form-control">
				<label class="label" for="email">
					<span class="label-text">Email Address</span>
				</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="input input-bordered w-full"
					aria-describedby="error-message"
					aria-invalid={error}
				/>
			</div>

			<div class="form-control">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="input input-bordered w-full"
					aria-describedby="error-message"
					aria-invalid={error}
				/>
			</div>

			{#if error}
				<div class="alert alert-error" id="error-message">
					<span>{error}</span>
				</div>
			{/if}

			<button
				type="submit"
				aria-label="Sign In"
				name="sign-in"
				disabled={navigating.to != null}
				class="btn btn-primary w-full"
			>
				{#if navigating.to}
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
