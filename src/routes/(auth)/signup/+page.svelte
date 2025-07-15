<!-- signup form: create a new user account -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { Check } from 'lucide-svelte';
	import AuthNav from '$lib/components/NavBar/AuthNav.svelte';

	let email = '';
	let password = '';
	let full_name = '';
	let display_name = '';
	let error = '';

	async function submit() {
		const res = await fetch('/api/users/signup', {
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

<div class="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<AuthNav />
		<!-- Form -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<form on:submit|preventDefault={submit} class="space-y-6">
					<div class="form-control">
						<label for="full_name" class="label">
							<span class="label-text">Full Name</span>
						</label>
						<input
							id="full_name"
							type="text"
							bind:value={full_name}
							placeholder="Enter your full name"
							required
							class="input input-bordered w-full"
						/>
					</div>

					<div class="form-control">
						<label for="display_name" class="label">
							<span class="label-text">Display Name</span>
						</label>
						<input
							id="display_name"
							type="text"
							bind:value={display_name}
							placeholder="Choose a display name"
							required
							class="input input-bordered w-full"
						/>
					</div>

					<div class="form-control">
						<label for="email" class="label">
							<span class="label-text">Email Address</span>
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							required
							class="input input-bordered w-full"
						/>
					</div>

					<div class="form-control">
						<label for="password" class="label">
							<span class="label-text">Password</span>
						</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Create a password"
							required
							class="input input-bordered w-full"
						/>
					</div>

					{#if error}
						<div class="alert alert-error">
							<span>{error}</span>
						</div>
					{/if}

					<button type="submit" disabled={navigating.to != null} class="btn btn-primary w-full">
						{#if navigating.to}
							Creating Account...
						{:else}
							Create Account
						{/if}
					</button>
				</form>

				<!-- Benefits -->
				<div class="border-base-200 mt-8 border-t pt-6">
					<div class="space-y-3">
						<div class="flex items-center space-x-3">
							<Check class="text-success h-5 w-5" />
							<span class="text-base-content/70 text-sm">Free forever plan available</span>
						</div>
						<div class="flex items-center space-x-3">
							<Check class="text-success h-5 w-5" />
							<span class="text-base-content/70 text-sm">No credit card required</span>
						</div>
						<div class="flex items-center space-x-3">
							<Check class="text-success h-5 w-5" />
							<span class="text-base-content/70 text-sm">Access to all basic features</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Sign In Link -->
		<div class="text-center">
			<p class="text-base-content/70">
				Already have an account?
				<a href="/login" class="text-primary hover:text-primary-focus font-semibold">
					Sign in here
				</a>
			</p>
		</div>
	</div>
</div>
