<script lang="ts">
	import { navigating } from '$app/state';

	export let data;
	export let form: {
		success: boolean;
		error?: string;
		errors?: { name?: string; email?: string; password?: string };
	};

	let name = data.user?.user_metadata.display_name;
	let email = data.user?.email;
	let password = '';

	$: if (form?.success) {
		name = data.user?.user_metadata.display_name;
		email = data.user?.email;
		password = '';
	}
</script>

<div class="flex flex-col items-center gap-4">
	<h1>Account Settings</h1>
	<p class="text-lg"><strong>Hello, </strong> {data.user?.user_metadata.display_name}!</p>
	<p class="text-base-content/70">Check out and edit your account info</p>

	<form method="POST" class="w-full max-w-xl">
		<div class="form-control mb-4">
			<label for="name" class="label sr-only">
				<span class="label-text">Display name:</span>
			</label>
			<input
				id="name"
				name="name"
				type="text"
				autocomplete="name"
				bind:value={name}
				class="input input-bordered flex-1"
				aria-invalid={!!form?.errors?.name}
				aria-describedby="name-error"
			/>
			{#if form?.errors?.name}
				<p id="name-error" class="text-error mt-1 text-sm">{form.errors.name}</p>
			{/if}
		</div>
		<div class="form-control mb-4">
			<label for="email" class="label sr-only">
				<span class="label-text">Email:</span>
			</label>
			<input
				id="email"
				name="email"
				type="email"
				autocomplete="email"
				bind:value={email}
				class="input input-bordered flex-1"
				aria-invalid={!!form?.errors?.email}
				aria-describedby="email-error"
			/>
			{#if form?.errors?.email}
				<p id="email-error" class="text-error mt-1 text-sm">{form.errors.email}</p>
			{/if}
		</div>
		<div class="form-control mb-4">
			<label for="password" class="label sr-only">
				<span class="label-text">Password:</span>
			</label>
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="new-password"
				placeholder="Leave blank if no change"
				bind:value={password}
				class="input input-bordered flex-1"
				aria-invalid={!!form?.errors?.password}
				aria-describedby="password-error"
			/>
			{#if form?.errors?.password}
				<p id="password-error" class="text-error mt-1 text-sm">{form.errors.password}</p>
			{/if}
		</div>
		<div>
			{#if form?.error}
				<div class="alert alert-error" role="alert">
					<span>{form.error}</span>
				</div>
			{/if}

			<button
				type="submit"
				disabled={navigating.to != null}
				class="btn btn-primary focus-visible:ring"
			>
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

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
