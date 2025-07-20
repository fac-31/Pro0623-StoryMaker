import { test, expect, request } from '@playwright/test';

test('Creating a team', async ({ page }) => {
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

	let response;

	// Create a team
	response = await apiContext.post('/api/teams/create', { data: { name: 'Team Potato' } });
	expect(response.ok(), await response.text()).toBeTruthy();
	const resultTeam = await response.json();

	// Get yourself and all other users
	const resultMe = await (await apiContext.get('/api/users/me')).json();
	const resultAll = await (await apiContext.get('/api/users/getall')).json();

	// Find any user that's not us to add to team
	const user = resultAll.find((user) => user._id !== resultMe._id);

	// Add user to the team
	response = await apiContext.post('/api/teams/updateuser', {
		data: {
			team_id: resultTeam.insertedId,
			user_id: user._id,
			role: 'user'
		}
	});
	expect(response.ok(), await response.text()).toBeTruthy();

	// Update same user to be an admin
	response = await apiContext.post('/api/teams/updateuser', {
		data: {
			team_id: resultTeam.insertedId,
			user_id: user._id,
			role: 'admin'
		}
	});
	expect(response.ok(), await response.text()).toBeTruthy();

	// Remove user from team
	response = await apiContext.post('/api/teams/removeuser', {
		data: {
			team_id: resultTeam.insertedId,
			user_id: user._id
		}
	});
	expect(response.ok(), await response.text()).toBeTruthy();
});
