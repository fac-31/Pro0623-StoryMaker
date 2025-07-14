import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  const uniqueId = Date.now();
  const email = `testuser-${uniqueId}@example.com`;
  const password = 'password123';

  test('should allow a user to sign up and see the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Wait for navigation to the dashboard
    await page.waitForURL('/dashboard');

    // Verify redirection and dashboard content
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'My Storyboards' })).toBeVisible();
  });

  test('should allow a user to log in and log out', async ({ page }) => {
    // --- 1. Sign up a new user to test with ---
    const loginEmail = `login-${uniqueId}@example.com`;
    const loginPassword = 'password123';

    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(loginEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(loginPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');

    // --- 2. Log out ---
    // Assuming the logout button is in a dropdown or menu
    await page.getByRole('button', { name: 'Open user menu' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();


    // Verify redirection to the home page
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();


    // --- 3. Log back in ---
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(loginEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(loginPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify redirection and dashboard content
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'My Storyboards' })).toBeVisible();
  });
});
