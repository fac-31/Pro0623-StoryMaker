async function start() {
	const [story, interactions] = await Promise.all([
		fetch('story.json').then((r) => r.json()),
		fetch('interactions.json').then((r) => r.json())
	]);
	let index = 0;
	const el = document.getElementById('game');
	showSlide();
	function showSlide() {
		const slide = story.visualSlides[index];
		el.innerHTML = '';
		const img = document.createElement('img');
		img.src = slide.imageUrl;
		el.appendChild(img);
		const p = document.createElement('p');
		p.textContent = interactions[index]?.description || '';
		el.appendChild(p);
		const btn = document.createElement('button');
		btn.textContent = index < story.visualSlides.length - 1 ? 'Next' : 'Finish';
		btn.addEventListener('click', () => {
			index++;
			if (index < story.visualSlides.length) {
				showSlide();
			}
		});
		el.appendChild(btn);
	}
}
start();
