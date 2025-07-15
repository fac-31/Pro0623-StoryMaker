<script lang="ts">
	import { ArrowRight, Play, Check, BookOpen } from 'lucide-svelte';
</script>

<section class="relative overflow-hidden py-20 lg:py-32">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div class="space-y-8">
				<div class="space-y-4">
					<div
						class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
					>
						✨ AI-Powered Storyboarding
					</div>
					<h1 class="text-4xl leading-tight font-bold text-gray-900 lg:text-6xl">
						Turn Your
						<span
							class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
						>
							Stories
						</span>
						Into Visual Magic
					</h1>
					<p class="text-xl leading-relaxed text-gray-600">
						Create professional storyboards from your story ideas in minutes. Customize by style,
						target audience, and genre to bring your vision to life.
					</p>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row">
					<a
						href="/signup"
						class="flex transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:from-purple-700 hover:to-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
					>
						<span>Start Creating Free</span>
						<ArrowRight class="h-5 w-5" />
					</a>
					<a
						href="/storyboard"
						class="flex items-center justify-center space-x-2 rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-all hover:border-purple-300 hover:text-purple-600 motion-reduce:transition-none"
					>
						<Play class="h-5 w-5" />
						<span>Try Demo</span>
					</a>
				</div>

				<div class="flex items-center space-x-6 text-sm text-gray-500">
					<div class="flex items-center space-x-1">
						<Check class="h-4 w-4 text-green-500" />
						<span>No credit card required</span>
					</div>
					<div class="flex items-center space-x-1">
						<Check class="h-4 w-4 text-green-500" />
						<span>Free templates</span>
					</div>
				</div>
			</div>

			<div class="relative">
				<div
					class="rotate-3 transform rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 p-8 transition-transform duration-300 hover:rotate-0 motion-reduce:transform-none"
				>
					<div
						class="flex h-64 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-200 to-blue-200 shadow-2xl"
					>
						<div class="text-center text-purple-600">
							<BookOpen class="mx-auto mb-4 h-16 w-16" />
							<p class="text-lg font-semibold">StoryMaker Interface</p>
							<p class="text-sm">AI-Powered Storyboarding</p>
						</div>
					</div>
				</div>
				<div
					class="absolute -top-4 -right-4 rotate-12 transform rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-yellow-900"
				>
					New!
				</div>
			</div>
		</div>
	</div>
</section>
