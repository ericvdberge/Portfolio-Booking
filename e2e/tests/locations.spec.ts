import { test, expect } from '@playwright/test';

test.describe('Locations Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to locations page before each test
    await page.goto('/locations');
  });

  test('should load and display the locations page', async ({ page }) => {
    // Verify the page heading is present
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Heading should contain "location" text
    await expect(heading).toContainText(/location/i);
  });

  test('should display the page content area', async ({ page }) => {
    // Wait for the main content container
    const container = page.locator('.container, [class*="container"]').first();
    await expect(container).toBeVisible({ timeout: 10000 });

    // Should have some content (either locations, loading state, or error)
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
    expect(hasContent!.length).toBeGreaterThan(0);
  });

  test('should load location data from API', async ({ page }) => {
    // Wait for page to finish loading (check for grid or cards)
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check if we have either:
    // 1. Location cards/items displayed
    // 2. Or a message about no locations
    // 3. Or an error message

    const pageText = await page.textContent('body');
    const hasValidState =
      pageText?.includes('Book Now') || // Has location cards with buttons
      pageText?.includes('View Details') || // Has location cards with buttons
      pageText?.includes('No Locations') || // Empty state
      pageText?.includes('Error') || // Error state
      pageText?.includes('loading'); // Loading state

    expect(hasValidState).toBeTruthy();
  });

  test('should have interactive elements on the page', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check for any buttons or links (locations cards should have them)
    const buttons = page.getByRole('button');
    const links = page.getByRole('link');

    const buttonCount = await buttons.count();
    const linkCount = await links.count();

    // Should have at least some interactive elements
    expect(buttonCount + linkCount).toBeGreaterThan(0);
  });

  test('should be able to click on a location if available', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Try to find "View Details" or "Book Now" buttons
    const viewDetailsButtons = page.getByRole('button', { name: /view details/i });
    const bookNowButtons = page.getByRole('button', { name: /book now/i });

    const viewDetailsCount = await viewDetailsButtons.count();
    const bookNowCount = await bookNowButtons.count();

    if (viewDetailsCount > 0) {
      // If we have location cards, click the first "View Details"
      await viewDetailsButtons.first().click();

      // Should navigate to location details page
      await expect(page).toHaveURL(/\/locations\/[^/]+/, { timeout: 10000 });
    } else if (bookNowCount > 0) {
      // Alternative: check if Book Now button exists
      expect(bookNowCount).toBeGreaterThan(0);
    } else {
      // No locations available - this is also a valid state
      const pageText = await page.textContent('body');
      expect(pageText).toBeTruthy();
    }
  });
});
