import { test, expect } from '@playwright/test';

test.describe('Keyboard Accessibility', () => {
	test('Dashboard keyboard navigation should work properly', async ({ page }) => {
		// Login first
		const uniqueId = Date.now();
		const email = `testuser-${uniqueId}@example.com`;
		const password = 'password123';

		await page.goto('http://localhost:5173/signup');
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('textbox', { name: 'Full Name' }).fill('Test User');
		await page.getByRole('textbox', { name: 'Display Name' }).fill(`TestDisplay${uniqueId}`);
		await page.getByRole('button', { name: 'Create Account' }).click();

		await page.waitForURL('http://localhost:5173/login');
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('button', { name: 'Sign in' }).click();
		await page.waitForURL('http://localhost:5173/dashboard');

		// Test tab order - should be logical
		await page.keyboard.press('Tab'); // Should focus first interactive element
		const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
		expect(['BUTTON', 'A', 'INPUT']).toContain(firstFocus);

		// Test that all navigation buttons are reachable via keyboard
		const navButtons = ['My Storyboards', 'My Teams', 'Settings'];
		for (const buttonName of navButtons) {
			await page.getByRole('button', { name: buttonName }).focus();
			const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
			expect(focused).toBe(buttonName);
		}

		// Test Escape key closes modals (if any are open)
		await page.keyboard.press('Escape');
		// Should not throw errors or break the page
	});

	test('Focus indicators should be visible', async ({ page }) => {
		await page.goto('http://localhost:5173/login');

		// Focus on login button and check for focus indicator
		await page.getByRole('button', { name: 'Sign in' }).focus();

		// Check if focus styles are applied (this is a basic check)
		const focusedElement = page.getByRole('button', { name: 'Sign in' });
		const hasOutline = await focusedElement.evaluate((el) => {
			const styles = window.getComputedStyle(el);
			return styles.outline !== 'none' || styles.boxShadow !== 'none';
		});

		expect(hasOutline).toBe(true);
	});

	test('Skip links should work', async ({ page }) => {
		await page.goto('http://localhost:5173/');

		// Tab to skip link (should be first focusable element)
		await page.keyboard.press('Tab');

		// Check if skip link is focused
		const skipLink = page.getByRole('link', { name: 'Skip to main content' });
		await expect(skipLink).toBeFocused();

		// Press Enter to activate skip link
		await page.keyboard.press('Enter');

		// Check if main content is now focused
		const mainContent = page.locator('#main-content');
		await expect(mainContent).toBeFocused();
	});
});
