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
					<h1 class="text-base-content text-4xl leading-tight font-bold lg:text-6xl">
						Turn Your
						<span
							class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
						>
							Stories
						</span>
						Into Visual Magic
					</h1>
					<p class="text-base-content/70 text-xl leading-relaxed">
						Create professional storyboards from your story ideas in minutes. Customize by style,
						target audience, and genre to bring your vision to life.
					</p>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row">
					<a href="/signup" class="btn btn-primary btn-lg">
						<span>Start Creating Free</span>
						<ArrowRight class="h-5 w-5" />
					</a>
					<a href="/storyboard" class="btn btn-outline btn-lg">
						<Play class="h-5 w-5" />
						<span>Try Demo</span>
					</a>
				</div>

				<div class="text-base-content/50 flex items-center space-x-6 text-sm">
					<div class="flex items-center space-x-1">
						<Check class="text-success h-4 w-4" />
						<span>No credit card required</span>
					</div>
					<div class="flex items-center space-x-1">
						<Check class="text-success h-4 w-4" />
						<span>Free templates</span>
					</div>
				</div>
			</div>

			<div class="relative">
				<div
					class="rotate-3 transform rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 p-8 transition-transform duration-300 hover:rotate-0"
				>
					<div
						class="flex h-64 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-200 to-blue-200 shadow-2xl"
					>
						<div class="text-primary text-center">
							<BookOpen class="mx-auto mb-4 h-16 w-16" />
							<p class="text-lg font-semibold">StoryMaker Interface</p>
							<p class="text-sm">AI-Powered Storyboarding</p>
						</div>
					</div>
				</div>
				<div class="badge badge-warning absolute -top-4 -right-4 rotate-12 transform">New!</div>
			</div>
		</div>
	</div>
</section>
