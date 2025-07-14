import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  const uniqueId = Date.now();
  const email = `testuser-${uniqueId}@example.com`;
  const password = 'password123';
  const fullName = 'Test User';
  const displayName = `TestDisplay${uniqueId}`;

  test('should allow a user to sign up and then log in', async ({ page }) => {
    // --- 1. Sign up ---
    await page.goto('/signup');

    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('textbox', { name: 'Full Name' }).fill(fullName);
    await page.getByRole('textbox', { name: 'Display Name' }).fill(displayName);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Verify redirection to login page after signup
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

    // --- 2. Log in with the newly created user ---
    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify redirection to dashboard after login
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'My Storyboards' })).toBeVisible();
  });

  test('should allow a user to log out', async ({ page }) => {
    // This test assumes a user is already logged in or signs up/logs in as part of its setup.
    // For simplicity, we'll re-use the signup/login flow from the previous test.
    const logoutEmail = `logout-${uniqueId}@example.com`;
    const logoutPassword = 'password123';
    const logoutFullName = 'Logout Test User';
    const logoutDisplayName = `LogoutDisplay${uniqueId}`;

    // Sign up and log in the user first
    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(logoutEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(logoutPassword);
    await page.getByRole('textbox', { name: 'Full Name' }).fill(logoutFullName);
    await page.getByRole('textbox', { name: 'Display Name' }).fill(logoutDisplayName);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForURL('/login');

    await page.getByRole('textbox', { name: 'Email Address' }).fill(logoutEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(logoutPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard');

    // --- Now, log out ---
    await page.getByRole('button', { name: 'Logout' }).click();

    // Verify redirection to the home page
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });
});
