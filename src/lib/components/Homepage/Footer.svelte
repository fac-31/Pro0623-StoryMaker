<script lang="ts">
	import { Play } from 'lucide-svelte';
</script>

<footer class="bg-gray-900 py-16 text-white">
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
				<p class="text-gray-400">
					Transform your story ideas into professional storyboards with AI-powered creativity.
				</p>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Product</h3>
				<ul class="space-y-2 text-gray-400">
					<li><a href="#features" class="transition-colors hover:text-white">Features</a></li>
					<li><a href="/storyboard" class="transition-colors hover:text-white">Storyboard</a></li>
					<li>
						<a href="/langchain-agent" class="transition-colors hover:text-white">AI Agent</a>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Account</h3>
				<ul class="space-y-2 text-gray-400">
					<li><a href="/signup" class="transition-colors hover:text-white">Sign Up</a></li>
					<li><a href="/login" class="transition-colors hover:text-white">Sign In</a></li>
					<li><a href="/logout" class="transition-colors hover:text-white">Sign Out</a></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Support</h3>
				<ul class="space-y-2 text-gray-400">
					<li><a href="/help" class="transition-colors hover:text-white">Help Center</a></li>
					<li><a href="/privacy" class="transition-colors hover:text-white">Privacy</a></li>
					<li><a href="/terms" class="transition-colors hover:text-white">Terms</a></li>
				</ul>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row"
		>
			<p class="text-gray-400">© 2024 StoryMaker. All rights reserved.</p>
			<div class="mt-4 flex space-x-6 md:mt-0">
				<a href="https://twitter.com" class="text-gray-400 transition-colors hover:text-white"
					>Twitter</a
				>
				<a href="https://linkedin.com" class="text-gray-400 transition-colors hover:text-white"
					>LinkedIn</a
				>
				<a href="https://instagram.com" class="text-gray-400 transition-colors hover:text-white"
					>Instagram</a
				>
			</div>
		</div>
	</div>
</footer>
