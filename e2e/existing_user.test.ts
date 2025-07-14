import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('header').getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('annavanwingerden@outlook.com');
  await page.getByRole('textbox', { name: 'Email Address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('testing');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.waitForURL('/dashboard');
  await expect(page).toHaveURL('/dashboard');
  await page.getByRole('button', { name: 'Logout' }).click();
});