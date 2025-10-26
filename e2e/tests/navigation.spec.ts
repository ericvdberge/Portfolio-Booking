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

  test('should display category section with all three categories', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Verify category cards are visible
    const hotelCard = page.getByTestId('category-card-hotels');
    const bnbCard = page.getByTestId('category-card-b&bs');
    const allCard = page.getByTestId('category-card-all venues');

    await expect(hotelCard).toBeVisible();
    await expect(bnbCard).toBeVisible();
    await expect(allCard).toBeVisible();
  });

  test('should navigate to filtered locations page via Hotel category', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Click on Hotels category card
    const hotelCard = page.getByTestId('category-card-hotels');
    await hotelCard.scrollIntoViewIfNeeded();
    await expect(hotelCard).toBeVisible();

    await hotelCard.click();

    // Verify we navigated to locations page with type filter
    await expect(page).toHaveURL('/locations?type=1');
  });

  test('should navigate to filtered locations page via B&B category', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Click on B&B category card
    const bnbCard = page.getByTestId('category-card-b&bs');
    await bnbCard.scrollIntoViewIfNeeded();
    await expect(bnbCard).toBeVisible();

    await bnbCard.click();

    // Verify we navigated to locations page with type filter
    await expect(page).toHaveURL('/locations?type=2');
  });

  test('should navigate to all locations page via All Venues category', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Click on All Venues category card
    const allCard = page.getByTestId('category-card-all venues');
    await allCard.scrollIntoViewIfNeeded();
    await expect(allCard).toBeVisible();

    await allCard.click();

    // Verify we navigated to locations page without filter
    await expect(page).toHaveURL('/locations');
  });
});
