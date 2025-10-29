import { test, expect } from '@playwright/test';

test.describe('Sign In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  });

  test('should display all page elements correctly', async ({ page }) => {
    // Verify logo
    await expect(page.getByTestId('signin-logo')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('signin-logo-link')).toHaveAttribute('href', '/');

    // Verify form exists
    await expect(page.getByTestId('signin-form')).toBeVisible({ timeout: 10000 });

    // Verify input fields
    await expect(page.getByTestId('signin-email-field')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('signin-password-field')).toBeVisible({ timeout: 10000 });

    // Verify buttons
    await expect(page.getByTestId('signin-submit-button')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('signin-google-button')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('signin-github-button')).toBeVisible({ timeout: 10000 });

    // Verify links
    await expect(page.getByTestId('signin-forgot-password-link')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('signin-signup-link')).toBeVisible({ timeout: 10000 });

    // Verify checkbox
    await expect(page.getByTestId('signin-remember-me')).toBeVisible({ timeout: 10000 });
  });

  test('should validate empty form submission and show errors', async ({ page }) => {
    const submitButton = page.getByTestId('signin-submit-button');

    // Submit empty form
    await submitButton.click();

    // Both error messages should appear (HeroUI renders them)
    const emailField = page.getByTestId('signin-email-field');
    const passwordField = page.getByTestId('signin-password-field');

    await expect(emailField.locator('text=Email is required')).toBeVisible({ timeout: 10000 });
    await expect(passwordField.locator('text=Password is required')).toBeVisible({ timeout: 10000 });

    // Should still be on sign-in page
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should validate email formats and show appropriate errors', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const submitButton = page.getByTestId('signin-submit-button');
    const emailField = page.getByTestId('signin-email-field');

    // Test invalid format (no @)
    await emailInput.fill('notanemail');
    await submitButton.click();
    await expect(emailField.locator('text=Please enter a valid email address')).toBeVisible({ timeout: 10000 });

    // Test invalid format (@ but no domain)
    await emailInput.fill('test@');
    await submitButton.click();
    await expect(emailField.locator('text=Please enter a valid email address')).toBeVisible({ timeout: 10000 });

    // Valid email should clear error
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(1000); // Wait for onChange validation
    await expect(emailField.locator('text=Please enter a valid email address')).not.toBeVisible();
  });

  test('should validate password length requirements', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');
    const passwordField = page.getByTestId('signin-password-field');

    // Empty password
    await submitButton.click();
    await expect(passwordField.locator('text=Password is required')).toBeVisible({ timeout: 10000 });

    // Too short password
    await passwordInput.fill('12345');
    await submitButton.click();
    await expect(passwordField.locator('text=Password must be at least 6 characters')).toBeVisible({ timeout: 10000 });

    // Valid password clears error
    await passwordInput.fill('password123');
    await page.waitForTimeout(1000);
    await expect(passwordField.locator('text=Password must be at least 6 characters')).not.toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const toggleButton = page.getByTestId('signin-password-toggle');

    await passwordInput.fill('password123');

    // Initially hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle multiple field errors independently', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');
    const emailField = page.getByTestId('signin-email-field');
    const passwordField = page.getByTestId('signin-password-field');

    // Fill both with invalid data
    await emailInput.fill('notanemail');
    await passwordInput.fill('123');
    await submitButton.click();

    // Both errors should show
    await expect(emailField.locator('text=Please enter a valid email address')).toBeVisible({ timeout: 10000 });
    await expect(passwordField.locator('text=Password must be at least 6 characters')).toBeVisible({ timeout: 10000 });

    // Fix email only
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(1000);

    // Email error clears, password error remains
    await expect(emailField.locator('text=Please enter a valid email address')).not.toBeVisible();
    await expect(passwordField.locator('text=Password must be at least 6 characters')).toBeVisible({ timeout: 10000 });

    // Fix password
    await passwordInput.fill('password123');
    await page.waitForTimeout(1000);

    // Both errors cleared
    await expect(emailField.locator('text=Please enter a valid email address')).not.toBeVisible();
    await expect(passwordField.locator('text=Password must be at least 6 characters')).not.toBeVisible();
  });

  test('should submit form with valid credentials', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Fill with valid data
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Submit
    await submitButton.click();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('should have functional interactive elements', async ({ page }) => {
    // Test checkbox
    const rememberMe = page.getByTestId('signin-remember-me');
    await expect(rememberMe).not.toBeChecked();
    await rememberMe.click();
    await expect(rememberMe).toBeChecked();

    // Test links
    await expect(page.getByTestId('signin-forgot-password-link')).toHaveAttribute('href', '/forgot-password');
    await expect(page.getByTestId('signin-signup-link')).toHaveAttribute('href', '/signup');
  });
});

test.describe('Sign In Page - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  });

  test('should work correctly on mobile', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');
    const emailField = page.getByTestId('signin-email-field');
    const passwordField = page.getByTestId('signin-password-field');

    // Test validation
    await submitButton.tap();
    await expect(emailField.locator('text=Email is required')).toBeVisible({ timeout: 10000 });
    await expect(passwordField.locator('text=Password is required')).toBeVisible({ timeout: 10000 });

    // Fill and submit
    await emailInput.tap();
    await emailInput.fill('test@example.com');
    await passwordInput.tap();
    await passwordInput.fill('password123');
    await submitButton.tap();

    // Should navigate
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('should toggle password on mobile', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const toggleButton = page.getByTestId('signin-password-toggle');

    await passwordInput.tap();
    await passwordInput.fill('password123');

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleButton.tap();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
