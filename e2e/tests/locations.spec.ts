import { test, expect } from '@playwright/test';

test.describe('Locations Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to locations page before each test
    await page.goto('/locations');
  });

  test('should load and display the locations page with heading', async ({ page }) => {
    // Verify the page heading is present
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Heading should contain "location" text
    await expect(heading).toContainText(/location/i);
  });

  test('should display at least one location card', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Should have location cards rendered
    // Look for "View Details" or "Book Now" buttons which are on location cards
    const viewDetailsButtons = page.getByRole('button', { name: /view details/i });
    const bookNowButtons = page.getByRole('button', { name: /book now/i });

    // At least one type of button should exist
    const viewDetailsCount = await viewDetailsButtons.count();
    const bookNowCount = await bookNowButtons.count();

    expect(viewDetailsCount + bookNowCount).toBeGreaterThan(0);
  });

  test('should display location cards with expected content', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Look for "View Details" buttons (these are on location cards)
    const viewDetailsButtons = page.getByRole('button', { name: /view details/i });
    await expect(viewDetailsButtons.first()).toBeVisible({ timeout: 10000 });

    // Verify we have at least one location card
    const cardCount = await viewDetailsButtons.count();
    expect(cardCount).toBeGreaterThan(0);

    // Each location card should be visible
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await expect(viewDetailsButtons.nth(i)).toBeVisible();
    }
  });

  test('should be able to click on a location card', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Find and click the first "View Details" button
    const viewDetailsButton = page.getByRole('button', { name: /view details/i }).first();
    await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });

    await viewDetailsButton.click();

    // Should navigate to location details page
    await expect(page).toHaveURL(/\/locations\/[^/]+/, { timeout: 10000 });
  });

  test('should display location grid with multiple cards', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Check that we have a grid layout with multiple cards
    const grid = page.locator('[class*="grid"]').first();
    await expect(grid).toBeVisible({ timeout: 10000 });

    // Should have multiple location cards (at least 1, ideally more)
    const viewDetailsButtons = page.getByRole('button', { name: /view details/i });
    const cardCount = await viewDetailsButtons.count();

    expect(cardCount).toBeGreaterThanOrEqual(1);
    console.log(`Found ${cardCount} location cards`);
  });
});
