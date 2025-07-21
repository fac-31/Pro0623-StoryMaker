<script lang="ts">
	import { navigating } from '$app/state';
	export let data;
	export let form: { success: boolean; error?: string; field?: string };
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
		<div class="form-control mb-4" role="group">
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
			<div aria-live="assertive">
				{#if form?.error && form.field === 'name'}
					<p id="name-error" class="text-error text-sm mt-1">{form.error}</p>
				{/if}
			</div>
		</div>
		<div class="form-control mb-4" role="group">
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
			<div aria-live="assertive">
				{#if form?.error && form.field === 'email'}
					<p id="email-error" class="text-error text-sm mt-1">{form.error}</p>
				{/if}
			</div>
		</div>
		<div class="form-control mb-4" role="group">
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
			<div aria-live="assertive">
				{#if form?.error && form.field === 'password'}
					<p id="password-error" class="text-error text-sm mt-1">{form.error}</p>
				{/if}
			</div>
		</div>
		<div>
			{#if form?.error && !form.field}
				<div id="form-error" class="alert alert-error" role="alert" aria-live="assertive">
					<span>{form.error}</span>
				</div>
			{/if}

			<button type="submit" disabled={navigating.to != null} class="btn btn-primary">
				{#if navigating.to}Updating…{:else}Update Details{/if}
			</button>

			{#if form?.success}
				<div class="alert alert-success" role="alert" aria-live="assertive">
					<span>Details updated successfully!</span>
				</div>
			{/if}
		</div>
	</form>
</div>
