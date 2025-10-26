import { test, expect } from '@playwright/test';

test.describe('Homepage Navigation', () => {
  test('should navigate from home to locations page via Explore Venues button', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Find and click the "Explore Venues" button in the hero section using testid
    const exploreButton = page.getByTestId('hero-explore-venues-link');
    await expect(exploreButton).toBeVisible();

    await exploreButton.click();

    // Verify we navigated to the locations page
    await expect(page).toHaveURL('/locations');
  });

  test('should navigate from home to locations via CTA section button', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Scroll to CTA section to ensure button is visible
    const ctaButton = page.getByTestId('cta-start-browsing-link');
    await ctaButton.scrollIntoViewIfNeeded();
    await expect(ctaButton).toBeVisible();

    await ctaButton.click();

    // Verify we navigated to the locations page
    await expect(page).toHaveURL('/locations');
  });
});
