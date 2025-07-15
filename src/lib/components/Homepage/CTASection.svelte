<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
</script>

<section class="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<div class="space-y-8">
			<h2 class="text-3xl font-bold text-white lg:text-5xl">
				Ready to Bring Your Stories to Life?
			</h2>
			<p class="text-xl leading-relaxed text-primary-content/80">
				Join thousands of creators who are already using StoryMaker to visualize their ideas and
				captivate their audiences.
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/signup"
					class="btn btn-secondary btn-lg"
				>
					<span>Start Creating Free</span>
					<ArrowRight class="h-5 w-5" />
				</a>
				<a
					href="/storyboard"
					class="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary"
				>
					Try Demo
				</a>
			</div>
			<p class="text-sm text-primary-content/60">No credit card required • Free forever plan available</p>
		</div>
	</div>
</section>
