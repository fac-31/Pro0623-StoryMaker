import { test, expect, devices } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Navigation - Marketing', () => {
	test('Hamburger menu toggles mobile nav', async ({ page }) => {
		await page.goto('/');

		// Hamburger menu should be visible
		const hamburger = page.locator('button.btn-ghost.btn-square.md\\:hidden');
		await expect(hamburger).toBeVisible();

		// Mobile menu should be hidden initially
		const mobileNav = page.locator('nav.border-base-300.bg-base-100.border-t.md\\:hidden');
		await expect(mobileNav).toBeHidden();

		// Open mobile menu
		await hamburger.click();
		await expect(mobileNav).toBeVisible();

		// Close mobile menu
		await hamburger.click();
		await expect(mobileNav).toBeHidden();
	});

	test('Mobile nav links navigate correctly', async ({ page }) => {
		await page.goto('/');

		const hamburger = page.locator('button.btn-ghost.btn-square.md\\:hidden');
		const mobileMenu = page.locator('nav.border-base-300.bg-base-100.border-t.md\\:hidden');

		// Open mobile menu and click Features
		await hamburger.click();
		await expect(mobileMenu).toBeVisible();
		await mobileMenu.getByRole('link', { name: 'Features' }).click();
		await expect(page.evaluate(() => window.location.hash)).resolves.toBe('#features');

		// Wait for menu to close (there's a 100ms timeout in the component)
		await page.waitForTimeout(200);
		await expect(mobileMenu).toBeHidden();

		// Ensure hamburger is still visible and clickable
		await expect(hamburger).toBeVisible();

		// Open menu again and click How it Works
		await hamburger.click();
		// Give it a moment to open
		await page.waitForTimeout(100);
		await expect(mobileMenu).toBeVisible();
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

test.describe('Mobile Accessibility', () => {
	test('Mobile navigation should be accessible', async ({ page }) => {
		await page.goto('/');

		// Test accessibility on mobile viewport
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Touch targets should be at least 44x44px', async ({ page }) => {
		await page.goto('/login');

		// Check button sizes
		const buttons = page.locator('button');
		const buttonCount = await buttons.count();

		for (let i = 0; i < buttonCount; i++) {
			const button = buttons.nth(i);
			const box = await button.boundingBox();

			if (box) {
				// Touch targets should be at least 44x44px
				expect(box.width).toBeGreaterThanOrEqual(44);
				expect(box.height).toBeGreaterThanOrEqual(44);
			}
		}
	});

	test('Content should be readable at 200% zoom', async ({ page }) => {
		await page.goto('/');

		// Simulate 200% zoom by reducing viewport size to a more realistic mobile size
		await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE size

		// Check that content doesn't overflow horizontally excessively
		const body = page.locator('body');
		const scrollInfo = await body.evaluate((el) => ({
			scrollWidth: el.scrollWidth,
			clientWidth: el.clientWidth,
			ratio: el.scrollWidth / el.clientWidth
		}));

		// Allow some minor overflow but not excessive (less than 10% overflow is acceptable)
		expect(scrollInfo.ratio).toBeLessThan(1.1);
	});

	test('Dashboard mobile accessibility', async ({ page }) => {
		// Generate a unique user for dashboard testing
		const uniqueId = Date.now();
		const email = `testuser-${uniqueId}@example.com`;
		const password = 'password123';
		const fullName = 'Test User';
		const displayName = `TestDisplay${uniqueId}`;

		// Sign up and login
		await page.goto('/signup');
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('textbox', { name: 'Full Name' }).fill(fullName);
		await page.getByRole('textbox', { name: 'Display Name' }).fill(displayName);
		await page.getByRole('button', { name: 'Create Account' }).click();

		await page.waitForURL('/login');
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('button', { name: 'Sign in' }).click();
		await page.waitForURL('/dashboard');

		// Test dashboard accessibility on mobile
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
