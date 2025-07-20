import fs from 'fs/promises';
import path from 'path';

/**
 * Build a simple HTML/JS game bundle using storyboard and interactions.
 * @param {object} params
 * @param {object} params.storyboard - Full storyboard JSON
 * @param {object} params.interactions - Game interactions JSON
 * @param {string} params.outputDir - Destination directory
 */
export async function buildGame({ storyboard, interactions, outputDir }) {
	await fs.mkdir(outputDir, { recursive: true });
	await fs.writeFile(path.join(outputDir, 'story.json'), JSON.stringify(storyboard, null, 2));
	await fs.writeFile(
		path.join(outputDir, 'interactions.json'),
		JSON.stringify(interactions, null, 2)
	);

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Story Game</title>
<style>
body{margin:0;font-family:sans-serif}
#game{width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center}
img{max-width:100%;height:auto}
</style>
</head>
<body>
<div id="game"></div>
<script src="game.js"></script>
</body>
</html>`;

	const js = `async function start(){\n  const [story, interactions] = await Promise.all([\n    fetch('story.json').then(r=>r.json()),\n    fetch('interactions.json').then(r=>r.json())\n  ]);\n  let index=0;\n  const el=document.getElementById('game');\n  showSlide();\n  function showSlide(){\n    const slide=story.visualSlides[index];\n    el.innerHTML='';\n    const img=document.createElement('img');\n    img.src=slide.imageUrl;\n    el.appendChild(img);\n    const p=document.createElement('p');\n    p.textContent=interactions[index]?.description || '';\n    el.appendChild(p);\n    const btn=document.createElement('button');\n    btn.textContent=index < story.visualSlides.length-1 ? 'Next' : 'Finish';\n    btn.addEventListener('click',()=>{\n      index++;\n      if(index<story.visualSlides.length){\n        showSlide();\n      }\n    });\n    el.appendChild(btn);\n  }\n}\nstart();`;

	await fs.writeFile(path.join(outputDir, 'index.html'), html);
	await fs.writeFile(path.join(outputDir, 'game.js'), js);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [storyPath, interactionsPath, outDir] = process.argv.slice(2);
	if (!storyPath || !interactionsPath || !outDir) {
		console.error('Usage: node build-game.js <story.json> <interactions.json> <outputDir>');
		process.exit(1);
	}
	Promise.all([fs.readFile(storyPath, 'utf8'), fs.readFile(interactionsPath, 'utf8')])
		.then(([s, i]) => {
			return buildGame({
				storyboard: JSON.parse(s),
				interactions: JSON.parse(i),
				outputDir: outDir
			});
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}
