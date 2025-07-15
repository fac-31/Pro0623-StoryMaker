<script lang="ts">
	import { Play, ArrowLeft } from 'lucide-svelte';
	export let mobileMenuOpen: boolean = false;
</script>

<nav class="relative">
	<div class="text-center">
		<a
			href="/"
			class="mb-8 inline-flex items-center space-x-2 text-purple-600 transition-colors hover:text-purple-700"
		>
			<ArrowLeft class="h-5 w-5" />
			<span class:hidden={mobileMenuOpen} class="md:inline">Back to Home</span>
		</a>

		<div class="mb-6 flex justify-center">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600"
			>
				<Play class="h-6 w-6 text-white" />
			</div>
		</div>

		<h2
			class="mb-2 text-3xl font-bold text-gray-900"
			class:text-xl={mobileMenuOpen}
			class:text-3xl={!mobileMenuOpen}
		>
			Create Your Account
		</h2>
		<p class="text-gray-600" class:text-sm={mobileMenuOpen}>
			Join thousands of creators using StoryMaker
		</p>
	</div>
</nav>
