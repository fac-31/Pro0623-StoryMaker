import { test, expect } from '@playwright/test';

test('Create a storyboard', async ({ page }) => {
	// Generate a unique user with more randomness to avoid conflicts
	const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
	const email = `testuser-${uniqueId}@example.com`;
	const password = 'password123';
	const fullName = 'Test User';
	const displayName = `TestDisplay${uniqueId.replace(/[^a-zA-Z0-9]/g, '')}`;

	// Sign up the user
	await page.goto('/signup');
	await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('textbox', { name: 'Full Name' }).fill(fullName);
	await page.getByRole('textbox', { name: 'Display Name' }).fill(displayName);
	await page.getByRole('button', { name: 'Create Account' }).click();

	// Wait for redirect to login
	await page.waitForURL('/login', { timeout: 60000 });
	await expect(page).toHaveURL('/login');

	// Log in with the new user
	await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Sign in' }).click();

	// Wait for redirect to dashboard
	await page.waitForURL('/dashboard');
	await expect(page).toHaveURL('/dashboard');

	// Now create a storyboard
	await page.getByRole('button', { name: 'New Storyboard' }).click();
	await page.getByRole('textbox', { name: 'Story Concept:' }).click();
	await page.getByRole('textbox', { name: 'Story Concept:' }).fill('monkey makes a new friend');
	await page.getByRole('textbox', { name: 'Story Style:' }).click();
	await page.getByRole('textbox', { name: 'Story Style:' }).fill('realistic');
	await page.getByRole('spinbutton', { name: 'Number of Slides:' }).click();
	await page.getByRole('spinbutton', { name: 'Number of Slides:' }).fill('2');
	await page.getByRole('textbox', { name: 'Target Audience:' }).click();
	await page
		.getByRole('textbox', { name: 'Target Audience:' })
		.fill('professionals living in london');
	await page.getByRole('textbox', { name: 'Target Audience:' }).press('Tab');
	await page.getByRole('textbox', { name: 'Genre:' }).fill('drama');
	await page.getByRole('button', { name: 'Start Storyboard' }).click();
});
