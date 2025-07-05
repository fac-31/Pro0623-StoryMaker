import { test, expect, request } from '@playwright/test';

test('Creating a team', async ({ page }) => {
	await page.goto('login');
	await page.getByRole('textbox', { name: 'Email' }).click();
	await page.getByRole('textbox', { name: 'Email' }).fill('potato@potato.com');
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('potato');
	await page.getByRole('button', { name: 'Log in' }).click();

	// Wait for redirect or token to be set
	await expect(page).toHaveURL('/');

	// Get all of the needed cookie headers for auth
	const cookies = await page.context().cookies();
	const cookieHeader = cookies
		.filter((c) => c.name.includes('sb-'))
		.map((c) => `${c.name}=${c.value}`)
		.join('; ');

	// Create api context with cookie headers
	const apiContext = await request.newContext({
		extraHTTPHeaders: {
			cookie: cookieHeader
		}
	});

	const response = await apiContext.post('/api/teams/create', { data: { name: 'Team Potato' } });
	expect(response.ok()).toBeTruthy();

	const data = await response.json();
	console.log('Result:', data);
});
