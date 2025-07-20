<script lang="ts">
	import { navigating } from '$app/state';
	import { onMount } from 'svelte';
	export let data;
	export let form: {
		success: boolean;
		errors?: {
			name?: string[];
			email?: string[];
			password?: string[];
			_errors?: string[];
		};
	};
	let name = data.user?.user_metadata.display_name;
	let email = data.user?.email;
	let password = '';
	$: if (form?.success) {
		name = data.user?.user_metadata.display_name;
		email = data.user?.email;
		password = '';
	}

	$: if (form?.errors) {
		onMount(() => {
			const errorSummary = document.getElementById('form-error-summary');
			if (errorSummary) {
				errorSummary.focus();
			}
		});
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1>Account Settings</h1>
	<p class="text-lg"><strong>Hello, </strong> {data.user?.user_metadata.display_name}!</p>
	<p class="text-base-content/70">Check out and edit your account info</p>

	<form method="POST" class="w-full max-w-xl">
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
					aria-describedby="name-error"
				/>
			</div>
			{#if form?.errors?.name}
			<div id="name-error" class="alert alert-error mt-2" role="alert" aria-live="polite">
				<span>{form.errors.name}</span>
			</div>
			{/if}
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
					aria-describedby="email-error"
				/>
			</div>
			{#if form?.errors?.email}
			<div id="email-error" class="alert alert-error mt-2" role="alert" aria-live="polite">
				<span>{form.errors.email}</span>
			</div>
			{/if}
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
					aria-describedby="password-error"
				/>
			</div>
			{#if form?.errors?.password}
			<div id="password-error" class="alert alert-error mt-2" role="alert" aria-live="polite">
				<span>{form.errors.password}</span>
			</div>
			{/if}
		</div>
		<div>
			{#if form?.errors?._errors}
				<div id="form-error-summary" class="alert alert-error mt-2" role="alert" aria-live="polite" tabindex="-1">
					<span>{form.errors._errors[0]}</span>
				</div>
			{/if}

			<button type="submit" disabled={navigating.to != null} class="btn btn-primary">
				{#if navigating.to}Updating…{:else}Update Details{/if}
			</button>

			{#if form?.success}
				<div class="alert alert-success mt-2" role="status" aria-live="polite">
					<span>Details updated successfully!</span>
				</div>
			{/if}
		</div>
	</form>
</div>
