import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Navigation - Marketing', () => {
	test('Hamburger menu toggles mobile nav', async ({ page }) => {
		await page.goto('/');
		// Hamburger menu should be visible
		const hamburger = page.locator('button.btn-ghost.btn-square.md\\:hidden');
		await expect(hamburger).toBeVisible();

		// Mobile menu should be hidden initially
		await expect(page.locator('div.border-base-300.bg-base-100.border-t.md\\:hidden')).toBeHidden();

		// Open mobile menu
		await hamburger.click();
		await expect(
			page.locator('div.border-base-300.bg-base-100.border-t.md\\:hidden')
		).toBeVisible();

		// Close mobile menu
		await hamburger.click();
		await expect(page.locator('div.border-base-300.bg-base-100.border-t.md\\:hidden')).toBeHidden();
	});

	test('Mobile nav links navigate correctly', async ({ page }) => {
		await page.goto('/');
		const hamburger = page.locator('button.btn-ghost.btn-square.md\\:hidden');
		await hamburger.click();
		// Click Features link in the open mobile menu only
		const mobileMenu = page.locator('div.border-base-300.bg-base-100.border-t.md\\:hidden');
		await mobileMenu.getByRole('link', { name: 'Features' }).click();
		await expect(page.evaluate(() => window.location.hash)).resolves.toBe('#features');
		// Open menu again and click How it Works
		await hamburger.click();
		await mobileMenu.getByRole('link', { name: 'How it Works' }).click();
		await expect(page).toHaveURL(/#how-it-works/);
	});
});

test.describe('Mobile Navigation - Dashboard', () => {
	test('Sidebar is closed by default and can be opened', async ({ page }) => {
		// Generate a unique user
		const uniqueId = Date.now();
		const email = `testuser-${uniqueId}@example.com`;
		const password = 'password123';
		const fullName = 'Test User';
		const displayName = `TestDisplay${uniqueId}`;

		// Sign up the user
		await page.goto('/signup');
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('textbox', { name: 'Full Name' }).fill(fullName);
		await page.getByRole('textbox', { name: 'Display Name' }).fill(displayName);
		await page.getByRole('button', { name: 'Create Account' }).click();

		// Wait for redirect to login
		await page.waitForURL('/login');
		await expect(page).toHaveURL('/login');

		// Log in with the new user
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('button', { name: 'Sign in' }).click();

		// Wait for redirect to dashboard
		await page.waitForURL('/dashboard');
		await expect(page).toHaveURL('/dashboard');

		// Sidebar should be closed (off screen) by default
		const sidebar = page.locator('aside.fixed.inset-y-0.left-0');
		await expect(sidebar).toHaveClass(/-translate-x-full/);

		// Hamburger button should be visible
		const sidebarToggle = page.locator('button[aria-label="Toggle sidebar"]');
		await expect(sidebarToggle).toBeVisible();

		// Open sidebar
		await sidebarToggle.click();
		await expect(sidebar).not.toHaveClass(/-translate-x-full/);
	});
});
