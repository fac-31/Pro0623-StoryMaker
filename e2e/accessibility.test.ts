import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
	test('Home page should have no automatically detectable accessibility issues', async ({
		page
	}) => {
		await page.goto('http://localhost:5173/'); // Adjust if your dev server runs on a different port

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Login page should have no automatically detectable accessibility issues', async ({
		page
	}) => {
		await page.goto('http://localhost:5173/login');

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Signup, dashboard, and storyboard creation pages should have no automatically detectable accessibility issues', async ({
		page
	}) => {
		// Generate a unique user
		const uniqueId = Date.now();
		const email = `testuser-${uniqueId}@example.com`;
		const password = 'password123';
		const fullName = 'Test User';
		const displayName = `TestDisplay${uniqueId}`;

		// Signup page
		await page.goto('http://localhost:5173/signup');
		let accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);

		// Fill out signup form
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('textbox', { name: 'Full Name' }).fill(fullName);
		await page.getByRole('textbox', { name: 'Display Name' }).fill(displayName);
		await page.getByRole('button', { name: 'Create Account' }).click();

		// Wait for redirect to login
		await page.waitForURL('http://localhost:5173/login');
		await expect(page).toHaveURL('http://localhost:5173/login');

		// Log in
		await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
		await page.getByRole('textbox', { name: 'Password' }).fill(password);
		await page.getByRole('button', { name: 'Sign in' }).click();

		// Wait for redirect to dashboard
		await page.waitForURL('http://localhost:5173/dashboard');
		await expect(page).toHaveURL('http://localhost:5173/dashboard');

		// Dashboard page - My Storyboards view (default)
		accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);

		// Test My Teams view
		await page.getByRole('button', { name: 'My Teams' }).click();
		accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);

		// Test Settings view
		await page.getByRole('button', { name: 'Settings' }).click();
		accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);

		// Return to My Storyboards for the rest of the test
		await page.getByRole('button', { name: 'My Storyboards' }).click();

		// Create a storyboard
		await page.getByRole('button', { name: 'New Storyboard' }).click();
		await page.getByRole('textbox', { name: 'Story Concept:' }).fill('monkey makes a new friend');
		await page.getByRole('textbox', { name: 'Story Style:' }).fill('realistic');
		await page.getByRole('spinbutton', { name: 'Number of Slides:' }).fill('2');
		await page
			.getByRole('textbox', { name: 'Target Audience:' })
			.fill('professionals living in london');
		await page.getByRole('textbox', { name: 'Target Audience:' }).press('Tab');
		await page.getByRole('textbox', { name: 'Genre:' }).fill('drama');
		await page.getByRole('button', { name: 'Start Storyboard' }).click();

		// Optionally, wait for storyboard page to load (adjust selector as needed)
		// await page.waitForSelector('h1');

		// Storyboard creation page
		accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
