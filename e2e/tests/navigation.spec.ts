import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test('should navigate from home to locations page via Explore Venues button', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await expect(page).toHaveTitle(/Portfolio Booking/i);

    // Find and click the "Explore Venues" button in the hero section
    // Using getByRole for better accessibility testing
    const exploreButton = page.getByRole('link', { name: /explore venues/i });
    await expect(exploreButton).toBeVisible();

    await exploreButton.click();

    // Verify we navigated to the locations page
    await expect(page).toHaveURL('/locations');

    // Verify the locations page header is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should navigate from home to locations via CTA section button', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Scroll to CTA section to ensure button is visible
    const ctaButton = page.getByRole('link', { name: /start browsing/i });
    await ctaButton.scrollIntoViewIfNeeded();
    await expect(ctaButton).toBeVisible();

    await ctaButton.click();

    // Verify we navigated to the locations page
    await expect(page).toHaveURL('/locations');
  });
});
