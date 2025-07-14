import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('Home page should have no automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('http://localhost:5173/'); // Adjust if your dev server runs on a different port

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Login page should have no automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});