<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
</script>

<section class="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<div class="space-y-8">
			<h2 class="text-3xl font-bold text-white lg:text-5xl">
				Ready to Bring Your Stories to Life?
			</h2>
			<p class="text-xl leading-relaxed text-purple-100">
				Join thousands of creators who are already using StoryMaker to visualize their ideas and
				captivate their audiences.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/signup"
					class="flex transform items-center justify-center space-x-2 rounded-lg bg-white px-8 py-4 font-semibold text-purple-600 transition-all hover:scale-105 hover:bg-gray-50"
				>
					<span>Start Creating Free</span>
					<ArrowRight class="h-5 w-5" />
				</a>
				<a
					href="/storyboard"
					class="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-purple-600"
				>
					Try Demo
				</a>
			</div>
			<p class="text-sm text-purple-200">No credit card required • Free forever plan available</p>
		</div>
	</div>
</section>
