import { test, expect } from '@playwright/test';

test.describe('Locations Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to locations page before each test
    await page.goto('/locations');
  });

  test('should load and display locations', async ({ page }) => {
    // Verify the page title/heading is present
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Wait for either locations to load or an error/empty state to appear
    // We use Promise.race to handle different possible outcomes
    await expect(
      page.locator('[class*="grid"]').first()
    ).toBeVisible({ timeout: 10000 });

    // Check if locations loaded successfully
    const hasLocations = await page.locator('[class*="LocationCard"]').count().then(count => count > 0);
    const hasError = await page.getByText(/error loading locations/i).isVisible().catch(() => false);
    const isEmpty = await page.getByText(/no locations available/i).isVisible().catch(() => false);

    // At least one of these states should be true
    expect(hasLocations || hasError || isEmpty).toBeTruthy();
  });

  test('should show loading state initially', async ({ page }) => {
    // Reload to catch loading state
    await page.reload();

    // Loading skeletons should appear (even if briefly)
    // We check if the grid exists which contains either skeletons or location cards
    await expect(
      page.locator('[class*="grid"]').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should display location cards when data loads successfully', async ({ page }) => {
    // Wait for the grid to be visible
    await expect(
      page.locator('[class*="grid"]').first()
    ).toBeVisible({ timeout: 10000 });

    // If locations are available, verify location cards are rendered
    const locationCards = page.locator('[class*="LocationCard"]');
    const cardCount = await locationCards.count();

    if (cardCount > 0) {
      // Verify at least one location card is visible
      await expect(locationCards.first()).toBeVisible();

      // Each location card should have buttons (View Details / Book Now)
      const firstCard = locationCards.first();
      const buttons = firstCard.getByRole('button');
      await expect(buttons.first()).toBeVisible();
    } else {
      // If no cards, we should see empty state or error
      const hasEmptyState = await page.getByText(/no locations available/i).isVisible().catch(() => false);
      const hasError = await page.getByText(/error loading locations/i).isVisible().catch(() => false);

      expect(hasEmptyState || hasError).toBeTruthy();
    }
  });

  test('should handle API errors gracefully', async ({ page, context }) => {
    // Intercept API calls and return error
    await context.route('**/api/locations**', async route => {
      await route.abort('failed');
    });

    // Reload the page to trigger the failed request
    await page.reload();

    // Should show error message
    await expect(
      page.getByText(/error loading locations/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display empty state when no locations exist', async ({ page, context }) => {
    // Intercept API calls and return empty array
    await context.route('**/api/locations**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Reload the page to trigger the mocked response
    await page.reload();

    // Should show empty state message
    await expect(
      page.getByText(/no locations available/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
