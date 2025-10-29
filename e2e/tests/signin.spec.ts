import { test, expect } from '@playwright/test';

test.describe('Sign In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
  });

  test('should display all page elements correctly', async ({ page }) => {
    // Verify logo
    await expect(page.getByTestId('signin-logo')).toBeVisible();
    await expect(page.getByTestId('signin-logo-link')).toHaveAttribute('href', '/');

    // Verify form exists
    await expect(page.getByTestId('signin-form')).toBeVisible();

    // Verify input fields
    await expect(page.getByTestId('signin-email-field')).toBeVisible();
    await expect(page.getByTestId('signin-password-field')).toBeVisible();

    // Verify buttons
    await expect(page.getByTestId('signin-submit-button')).toBeVisible();
    await expect(page.getByTestId('signin-google-button')).toBeVisible();
    await expect(page.getByTestId('signin-github-button')).toBeVisible();

    // Verify links
    await expect(page.getByTestId('signin-forgot-password-link')).toBeVisible();
    await expect(page.getByTestId('signin-signup-link')).toBeVisible();

    // Verify checkbox
    await expect(page.getByTestId('signin-remember-me')).toBeVisible();
  });

  test('should validate empty form submission and show all errors', async ({ page }) => {
    // Submit empty form
    await page.getByTestId('signin-submit-button').click();

    // Both errors should appear
    await expect(page.getByTestId('signin-email-error')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('signin-password-error')).toBeVisible({ timeout: 3000 });

    // Verify error messages
    await expect(page.getByTestId('signin-email-error')).toContainText('Email is required');
    await expect(page.getByTestId('signin-password-error')).toContainText('Password is required');

    // Should still be on sign-in page
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should validate email field with multiple invalid formats', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Test 1: Invalid format (no @)
    await emailInput.fill('notanemail');
    await submitButton.click();
    await expect(page.getByTestId('signin-email-error')).toContainText('Please enter a valid email address');

    // Test 2: Invalid format (@ but no domain)
    await emailInput.fill('test@');
    await submitButton.click();
    await expect(page.getByTestId('signin-email-error')).toContainText('Please enter a valid email address');

    // Test 3: Valid email clears error
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(500); // Wait for onChange validation
    await expect(page.getByTestId('signin-email-error')).not.toBeVisible();
  });

  test('should validate password field with length requirements', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Test 1: Empty password
    await submitButton.click();
    await expect(page.getByTestId('signin-password-error')).toContainText('Password is required');

    // Test 2: Too short (less than 6 characters)
    await passwordInput.fill('12345');
    await submitButton.click();
    await expect(page.getByTestId('signin-password-error')).toContainText('Password must be at least 6 characters');

    // Test 3: Valid password clears error
    await passwordInput.fill('password123');
    await page.waitForTimeout(500); // Wait for onChange validation
    await expect(page.getByTestId('signin-password-error')).not.toBeVisible();
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

    // Click to hide again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle multiple field errors independently', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Fill both with invalid data
    await emailInput.fill('notanemail');
    await passwordInput.fill('123');
    await submitButton.click();

    // Both errors should show
    await expect(page.getByTestId('signin-email-error')).toBeVisible();
    await expect(page.getByTestId('signin-password-error')).toBeVisible();

    // Fix email only
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(500);

    // Email error should clear, password error remains
    await expect(page.getByTestId('signin-email-error')).not.toBeVisible();
    await expect(page.getByTestId('signin-password-error')).toBeVisible();

    // Fix password
    await passwordInput.fill('password123');
    await page.waitForTimeout(500);

    // Both errors cleared
    await expect(page.getByTestId('signin-email-error')).not.toBeVisible();
    await expect(page.getByTestId('signin-password-error')).not.toBeVisible();
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

    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
  });

  test('should have functional remember me checkbox and navigation links', async ({ page }) => {
    // Test checkbox
    const rememberMe = page.getByTestId('signin-remember-me');
    await expect(rememberMe).not.toBeChecked();
    await rememberMe.click();
    await expect(rememberMe).toBeChecked();

    // Test links have correct hrefs
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
    await page.waitForLoadState('networkidle');
  });

  test('should display correctly and validate on mobile', async ({ page }) => {
    // Verify mobile layout
    await expect(page.getByTestId('signin-logo')).toBeVisible();
    await expect(page.getByTestId('signin-form')).toBeVisible();

    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Test validation on mobile
    await emailInput.tap();
    await passwordInput.tap();
    await submitButton.tap();

    // Errors should appear
    await expect(page.getByTestId('signin-email-error')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('signin-password-error')).toBeVisible({ timeout: 3000 });

    // Fill valid data and submit
    await emailInput.tap();
    await emailInput.fill('test@example.com');
    await passwordInput.tap();
    await passwordInput.fill('password123');
    await submitButton.tap();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
  });

  test('should toggle password visibility on mobile', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const toggleButton = page.getByTestId('signin-password-toggle');

    await passwordInput.tap();
    await passwordInput.fill('password123');

    // Toggle visibility
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleButton.tap();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await toggleButton.tap();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
