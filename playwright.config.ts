import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const filteredEnv = Object.fromEntries(
	Object.entries(process.env).filter((entry): entry is [string, string] => {
		const value = entry[1];
		return typeof value === 'string';
	})
) as { [key: string]: string };

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 5173,
		reuseExistingServer: true,
		env: filteredEnv
	},
	testDir: 'e2e',
	workers: 1, // Run tests one at a time
	use: {
		baseURL: 'http://localhost:5173'
	}
});
// This configuration sets up Playwright to run end-to-end tests for the application.
// It includes environment variable filtering to ensure only string values are passed to the test environment.
// The web server is configured to build and preview the application on port 5173.
// The test directory is set to 'e2e', and the base URL for tests is defined as 'http://localhost:5173'.
// This setup allows for comprehensive testing of the application's functionality, including authentication flows and user interactions.
