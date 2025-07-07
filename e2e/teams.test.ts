import { test, expect, request } from '@playwright/test';

test('Creating a team', async ({ page }) => {
	await page.goto('login');
	await page.getByRole('textbox', { name: 'Email Address' }).click();
	await page.getByRole('textbox', { name: 'Email Address' }).fill('potato@potato.com');
	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('potato');
	await page.getByRole('button', { name: 'Sign in' }).click();

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

	// Create a team
	const resultTeam = await (
		await apiContext.post('/api/teams/create', { data: { name: 'Team Potato' } })
	).json();

	// Get yourself and all other users
	const resultMe = await (await apiContext.get('/api/users/me')).json();
	const resultAll = await (await apiContext.get('/api/users/getall')).json();

	// Find any user thats not us to add to team
	const user = resultAll.find((user) => user._id !== resultMe._id);

	let response;

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
