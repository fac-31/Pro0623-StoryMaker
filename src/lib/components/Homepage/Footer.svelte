<script lang="ts">
	import { Play } from 'lucide-svelte';
</script>

<footer class="bg-neutral text-neutral-content py-16" role="contentinfo">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-4">
			<div class="space-y-4">
				<div class="flex items-center space-x-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600"
					>
						<Play class="h-4 w-4 text-white" />
					</div>
					<span class="text-xl font-bold">StoryMaker</span>
				</div>
				<p class="text-neutral-content/70">
					Transform your story ideas into professional storyboards with AI-powered creativity.
				</p>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Product</h3>
				<ul
					class="text-neutral-content/70 space-y-2"
					role="navigation"
					aria-label="Product links"
				>
					<li>
						<a href="#features" class="hover:text-neutral-content transition-colors">Features</a>
					</li>
					<li>
						<a href="/storyboard" class="hover:text-neutral-content transition-colors">Storyboard</a
						>
					</li>
					<li>
						<a href="/langchain-agent" class="hover:text-neutral-content transition-colors"
							>AI Agent</a
						>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Account</h3>
				<ul
					class="text-neutral-content/70 space-y-2"
					role="navigation"
					aria-label="Account links"
				>
					<li>
						<a href="/signup" class="hover:text-neutral-content transition-colors">Sign Up</a>
					</li>
					<li><a href="/login" class="hover:text-neutral-content transition-colors">Sign In</a></li>
				</ul>
			</div>
		</div>

		<div
			class="border-neutral-content/20 mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row"
		>
			<p class="text-neutral-content/70">© 2024 StoryMaker. All rights reserved.</p>
			<div class="mt-4 flex space-x-6 md:mt-0">
				<a
					href="https://twitter.com"
					class="text-neutral-content/70 hover:text-neutral-content transition-colors"
					aria-label="StoryMaker on Twitter">Twitter</a
				>
				<a
					href="https://linkedin.com"
					class="text-neutral-content/70 hover:text-neutral-content transition-colors"
					aria-label="StoryMaker on LinkedIn">LinkedIn</a
				>
				<a
					href="https://instagram.com"
					class="text-neutral-content/70 hover:text-neutral-content transition-colors"
					aria-label="StoryMaker on Instagram">Instagram</a
				>
			</div>
		</div>
	</div>
</footer>
