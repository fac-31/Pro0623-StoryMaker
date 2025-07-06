<!-- profile edit form to handle new email, password etc -->
<!-- Display info with edit buttons. Edit toggles form disabled then sends form data on submit? -->
<script>
	export let data;
	export let form;
	console.log(data.user);
	// Display name, email, pasword
</script>

<div class="flex flex-col items-center gap-4">
	<h1><strong>Hello: </strong> {data.user?.user_metadata.display_name}</h1>
	<h2>Check out and edit your account info!</h2>

	<form method="post" class="w-full max-w-xl">
		<div class="form-control mb-4">
			<div class="flex items-center gap-4">
				<label for="name" class="label max-w-[60px] flex-auto">
					<span class="label-text"> Name: </span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					autocomplete="name"
					value={data.user?.user_metadata.display_name}
					class="input input-bordered flex-1"
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
					value={data.user?.email}
					class="input input-bordered flex-1"
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
					class="input input-bordered flex-1"
				/>
			</div>
		</div>
		<div>
			<button type="submit" class="btn btn-primary">Update Details</button>
		</div>
	</form>
</div>
{#if form?.success}
	<p style="color: green;">Details updated successfully!</p>
{/if}
