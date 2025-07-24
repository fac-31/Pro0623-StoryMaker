import { test, expect } from '@playwright/test';
import { nvda } from '@guidepup/playwright';

test.describe('Screen Reader Accessibility', () => {
    test('Login form should be properly announced', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        // Start NVDA screen reader
        await nvda.start();

        try {
            // Navigate to email field
            await page.getByRole('textbox', { name: 'Email Address' }).focus();

            // Get what NVDA announces
            const announcement = await nvda.lastSpokenPhrase();

            // Should announce the label and field type
            expect(announcement.toLowerCase()).toContain('email');
            expect(announcement.toLowerCase()).toContain('edit'); // NVDA says "edit" for input fields

            // Navigate to password field
            await page.getByRole('textbox', { name: 'Password' }).focus();
            const passwordAnnouncement = await nvda.lastSpokenPhrase();

            expect(passwordAnnouncement.toLowerCase()).toContain('password');

        } finally {
            // Always stop NVDA
            await nvda.stop();
        }
    });

    // Note: This test requires NVDA to be installed on Windows
    // For CI/CD, you might want to skip this test or use a virtual screen reader
});