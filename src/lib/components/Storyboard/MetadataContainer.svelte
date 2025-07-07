<script lang="ts">
	import type { StoryboardOutput } from '$lib/langgraph/storyboardGraph';

	export let storyboard: StoryboardOutput;
</script>

<div class="metadata-container">
	<h2>Story Details</h2>
	<div class="metadata-grid">
		<div class="metadata-item">
			<strong>Title:</strong>
			{storyboard.storyOutline.storyMetadata.title}
		</div>
		<div class="metadata-item">
			<strong>Genre:</strong>
			{storyboard.storyOutline.storyMetadata.genre}
		</div>
		<div class="metadata-item">
			<strong>Style:</strong>
			{storyboard.storyOutline.storyMetadata.style}
		</div>
		<div class="metadata-item">
			<strong>Target Audience:</strong>
			{storyboard.storyOutline.storyMetadata.targetAudience}
		</div>
		<div class="metadata-item">
			<strong>Total Duration:</strong>
			{storyboard.storyOutline.storyMetadata.totalDuration}
		</div>
	</div>
</div>
