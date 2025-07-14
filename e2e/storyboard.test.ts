import { test } from '@playwright/test';

test('Create a storyboard', async ({ page }) => {
	await page.goto('http://localhost:5173/login');
	await page.getByRole('textbox', { name: 'Email Address' }).click();
	await page.getByRole('textbox', { name: 'Email Address' }).fill('annavanwingerden@outlook.com');
	await page.getByRole('textbox', { name: 'Email Address' }).press('Tab');
	await page.getByRole('textbox', { name: 'Password' }).fill('testing');
	await page.getByRole('button', { name: 'Sign In' }).click();
	await page.goto('http://localhost:5173/dashboard');
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
