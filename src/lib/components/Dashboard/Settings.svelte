<script lang="ts">
	import { navigating } from '$app/state';

	import type { User as SupabaseUser } from '@supabase/supabase-js';
	import type { ActionData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	interface Props {
		supabase: SupabaseUser;
		form?: ActionData;
	}
	let { supabase, form }: Props = $props();

	let name = $state(supabase?.user_metadata.display_name);
	let email = $state(supabase?.email);
	let password = $state('');

	// Use $effect.pre to react to prop changes before rendering
	$effect.pre(() => {
		// This ensures the component state updates if the supabase prop changes
		name = supabase?.user_metadata.display_name;
		email = supabase?.email;
	});

	$effect(() => {
		if (form?.success) {
			// Clear the password field on success
			password = '';
		}
	});
</script>

<div class="flex flex-col items-center gap-4">
	<h1>Account Settings</h1>
	<p class="text-lg"><strong>Hello, </strong> {supabase?.user_metadata.display_name}!</p>
	<p class="text-base-content/70">Check out and edit your account info</p>

    <form
		method="POST"
		action="?/changeSettings"
		class="w-full max-w-xl"
		use:enhance={() => {
			return async ({ result }) => {
				// If the form submission was successful, invalidate all data
				// causing load functions to re-run.
				if (result.type === 'success') {
					await invalidateAll();
				}
			};
		}}
	>
		<div class="form-control mb-4">
			<div class="flex items-center gap-4">
				<label for="name" class="label max-w-[60px] flex-auto">
					<span class="label-text"> Display name: </span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					autocomplete="name"
					bind:value={name}
					class="input input-bordered flex-1"
					aria-describedby="form-error"
				/>
			</div>
		</div>
		<div class="form-control mb-4">
			<div class="flex items-center gap-4">
				<label for="email" class="label max-w-[60px] flex-auto">
					<span class="label-text"> Email: </span>
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					bind:value={email}
					class="input input-bordered flex-1"
					aria-describedby="form-error"
				/>
			</div>
		</div>
		<div class="form-control mb-4">
			<div class="flex items-center gap-4">
				<label for="password" class="label max-w-[60px] flex-auto">
					<span class="label-text"> Password: </span>
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					placeholder="Leave blank if no change"
					bind:value={password}
					class="input input-bordered flex-1"
					aria-describedby="form-error"
				/>
			</div>
		</div>
		<div>
			{#if form?.error}
				<div id="form-error" class="alert alert-error" role="alert">
					<span>{form.error}</span>
				</div>
			{/if}

			<button type="submit" disabled={navigating.to != null} class="btn btn-primary">
				{#if navigating.to}Updating…{:else}Update Details{/if}
</button>

			{#if form?.success}
				<div class="alert alert-success" role="alert">
					<span>Details updated successfully!</span>
				</div>
			{/if}
		</div>
	</form>
</div>