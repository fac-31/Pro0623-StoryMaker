import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
  await page.goto('/');

  const h1Count = await page.locator('h1').count();
  console.log('Number of <h1> elements:', h1Count);

  if (h1Count > 0) {
    const isVisible = await page.locator('h1').isVisible();
    console.log('<h1> is visible:', isVisible);

    const h1Text = await page.locator('h1').textContent();
    console.log('Text content of <h1>:', h1Text);
  }
});