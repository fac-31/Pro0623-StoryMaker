import fs from 'fs';
import { OpenAI } from 'openai';


// Blog patterns (summarized for prompt size)
const blogPatterns = `
Accessibility Audit Criteria (from Maxitect Blog):

- Use semantic HTML: nav, main, section, article, ul, etc.
- Add aria-label for context and aria-describedby for help text.
- Use Tailwind accessibility classes: sr-only, focus-visible:ring-2, motion-reduce:hidden/block, focus:outline-none, focus:ring-2.
- Use browser-first form validation and proper labeling.
- Implement live regions for dynamic content (aria-live).
- Manage focus (e.g., focus trap, returnFocusOnDeactivate).
- Respect prefers-reduced-motion (motion-reduce).
- Set lang attribute for language switching.
- Group related form elements with role="group".
- Provide clear error messages, programmatically associated with inputs.
- Ensure focus indicators are visible and have sufficient contrast.
- Build reusable accessible component patterns.
`;

const importantFiles = [
  // UI Components
  'src/lib/components/StoryboardForm.svelte',
  'src/lib/components/SlideModal.svelte',
  'src/lib/components/SlideThumbnail.svelte',
  'src/lib/components/MetadataContainer.svelte',
  // Main Pages and Layouts
  'src/routes/+page.svelte',
  'src/routes/+layout.svelte',
  'src/routes/dashboard/+page.svelte',
  'src/routes/storyboard/+page.svelte',
  'src/routes/(protected)/+layout.svelte',
  'src/routes/(protected)/user/+page.svelte',
  'src/routes/(public)/signup/+page.svelte',
  'src/routes/(public)/login/+page.svelte',
  // Root HTML and CSS
  'src/app.html',
  'src/app.css'
];

// Only include files that actually exist (in case some are missing)
const filesToScan = importantFiles.filter(f => fs.existsSync(f));

let codeSamples = '';
for (const file of filesToScan) {
  const content = fs.readFileSync(file, 'utf8');
  codeSamples += `\n\nFile: ${file}\n` + content.substring(0, 2000); // limit per file for token safety
}

const prompt = `
You are an expert accessibility auditor. Using the following accessibility patterns and philosophy:

${blogPatterns}

Please audit the following codebase for accessibility, focusing on the above criteria. Provide a summary of strengths, weaknesses, and actionable recommendations. Be specific and reference files/lines where possible.

${codeSamples}
`;

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    });
    fs.writeFileSync('ai_accessibility_report.md', response.choices[0].message.content);
    console.log('Accessibility audit complete. Report saved to ai_accessibility_report.md');
  } catch (err) {
    console.error('Error running accessibility audit:', err);
    process.exit(1);
  }
}

main();