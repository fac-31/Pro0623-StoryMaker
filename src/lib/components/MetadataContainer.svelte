<script lang="ts">
	import type { Project } from '$lib/models/project.model';

	export let storyboard: Project;
</script>

<div class="metadata-container">
	<h2>Story Details</h2>
	<div class="metadata-grid">
		<div class="metadata-item">
			<strong>Title:</strong>
			{storyboard.prompts.concept}
		</div>
		<div class="metadata-item">
			<strong>Genre:</strong>
			{storyboard.prompts.genre}
		</div>
		<div class="metadata-item">
			<strong>Style:</strong>
			{storyboard.prompts.storyStyle}
		</div>
		<div class="metadata-item">
			<strong>Target Audience:</strong>
			{storyboard.prompts.targetAudience}
		</div>
		<!--
		<div class="metadata-item">
			<strong>Total Duration:</strong>
			{storyboard.storyOutline.storyMetadata.totalDuration}
		</div>
		-->
	</div>
</div>
