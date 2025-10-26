import { test, expect } from '@playwright/test';

test.describe('Locations Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to locations page before each test
    await page.goto('/locations');
  });

  test('should load and display the locations page with heading', async ({ page }) => {
    // Verify the page heading is present
    const heading = page.getByTestId('locations-page-heading');
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should display locations grid', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Should display the locations grid (not loading, error, or empty state)
    const grid = page.getByTestId('locations-grid');
    await expect(grid).toBeVisible({ timeout: 10000 });
  });

  test('should display at least one location card', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Should have location cards rendered
    const locationCards = page.getByTestId('location-card');

    // Wait for at least one card to be visible
    await expect(locationCards.first()).toBeVisible({ timeout: 10000 });

    // Verify we have at least one location card
    const cardCount = await locationCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display location card with all elements', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Get the first location card
    const firstCard = page.getByTestId('location-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Verify card has all expected elements
    await expect(firstCard.getByTestId('location-card-name')).toBeVisible();
    await expect(firstCard.getByTestId('location-card-address')).toBeVisible();
    await expect(firstCard.getByTestId('location-card-capacity')).toBeVisible();
    await expect(firstCard.getByTestId('location-card-hours')).toBeVisible();
    await expect(firstCard.getByTestId('location-card-book-now')).toBeVisible();
  });

  test('should be able to click on a location card', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Get the first location card and click it
    const firstCard = page.getByTestId('location-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    await firstCard.click();

    // Should navigate to location details page
    await expect(page).toHaveURL(/\/locations\/[^/]+/, { timeout: 10000 });
  });

  test('should be able to click book now button', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Get the first book now button
    const bookNowButton = page.getByTestId('location-card-book-now').first();
    await expect(bookNowButton).toBeVisible({ timeout: 10000 });

    // Click should work (currently shows alert, but tests button is clickable)
    await bookNowButton.click();

    // Wait a moment for any potential navigation or modal (currently alert)
    await page.waitForTimeout(500);
  });

  test('should display multiple location cards', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Get all location cards
    const locationCards = page.getByTestId('location-card');
    const cardCount = await locationCards.count();

    // Should have at least 1 card, ideally more
    expect(cardCount).toBeGreaterThanOrEqual(1);

    console.log(`Found ${cardCount} location cards`);

    // Verify first few cards are visible
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await expect(locationCards.nth(i)).toBeVisible();
    }
  });

  test('should display location type badge on cards', async ({ page }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Get the first location card
    const firstCard = page.getByTestId('location-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Verify the location type badge is present
    const typeBadge = firstCard.getByTestId('location-card-type');
    await expect(typeBadge).toBeVisible();

    // Verify the badge has text content (Hotel, B&B, or Venue)
    const badgeText = await typeBadge.textContent();
    expect(badgeText).toMatch(/Hotel|B&B|Venue/);
  });

  test('should display mobile-optimized cards on small screens', async ({ page, isMobile }) => {
    // Wait for page to finish loading
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Get the first location card
    const firstCard = page.getByTestId('location-card').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // On mobile, verify that card elements are visible and properly sized
    if (isMobile) {
      // Check that all essential elements are still visible on mobile
      await expect(firstCard.getByTestId('location-card-name')).toBeVisible();
      await expect(firstCard.getByTestId('location-card-type')).toBeVisible();
      await expect(firstCard.getByTestId('location-card-book-now')).toBeVisible();
    }
  });
});
