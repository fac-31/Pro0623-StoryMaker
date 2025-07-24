<script lang="ts">
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import MarketingNav from '$lib/components/NavBar/MarketingNav.svelte';
	import HeroSection from '$lib/components/Homepage/HeroSection.svelte';
	import FeatureSection from '$lib/components/Homepage/FeatureSection.svelte';
	import StepSection from '$lib/components/Homepage/StepSection.svelte';
	import TestimonialSection from '$lib/components/Homepage/TestimonialSection.svelte';
	import CtaSection from '$lib/components/Homepage/CTASection.svelte';
	import Footer from '$lib/components/Homepage/Footer.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let showModal = false;
</script>

<div class="bg-base-200 min-h-screen">
	<NavBar>
		<MarketingNav slot="nav" let:mobileMenuOpen {mobileMenuOpen} />
	</NavBar>
	<HeroSection />
	<FeatureSection />
	<StepSection />
	<TestimonialSection />
	<CtaSection />

	<div class="text-center p-4">
		<button class="btn btn-primary" on:click={() => (showModal = true)}>Open Modal</button>
	</div>

	<Footer />
</div>

<Modal showModal={showModal} close={() => (showModal = false)}>
	<h2 class="text-2xl font-bold">Modal Title</h2>
	<p class="py-4">This is the modal content.</p>
</Modal>
