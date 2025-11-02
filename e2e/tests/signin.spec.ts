import { test, expect } from '@playwright/test';
import { LoginFormErrors } from '@frontend/types/form-errors';

/**
 * Test suite for Sign In Page functionality
 * Tests form validation, user interactions, and navigation
 */
test.describe('Sign In Page', () => {
  /**
   * Set up test environment by navigating to sign-in page
   * and waiting for form to be ready
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('domcontentloaded');
    // Wait for the signin form to be visible instead of networkidle
    await page.getByTestId('signin-form').waitFor({ timeout: 15000 });
  });

  /**
   * Verifies that all essential page elements are visible and properly configured
   * Including logo, form, input fields, buttons, and links
   */
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

  /**
   * Tests form validation when submitting empty form
   * Should display required field errors for both email and password
   */
  test('should validate empty form submission and show errors', async ({ page }) => {
    const submitButton = page.getByTestId('signin-submit-button');

    // Submit empty form
    await submitButton.click();

    // Both required error messages should appear using enum values
    const emailField = page.getByTestId('signin-email-field');
    const passwordField = page.getByTestId('signin-password-field');

    await expect(emailField.getByText(LoginFormErrors.EMAIL_REQUIRED)).toBeVisible({ timeout: 10000 });
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_REQUIRED)).toBeVisible({ timeout: 10000 });

    // Should still be on sign-in page
    await expect(page).toHaveURL(/sign-in/);
  });

  /**
   * Tests email format validation with various invalid email formats
   * Should show appropriate error messages and clear them when valid email is entered
   */
  test('should validate email formats and show appropriate errors', async ({ page }) => {
    const emailField = page.getByTestId('signin-email-field');
    const emailInput = page.getByTestId('signin-email-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Test invalid format (no @)
    await emailInput.fill('notanemail');
    await submitButton.click();
    await expect(emailField.getByText(LoginFormErrors.EMAIL_INVALID)).toBeVisible({ timeout: 10000 });

    // Test invalid format (@ but no domain)
    await emailInput.fill('test@');
    await submitButton.click();
    await expect(emailField.getByText(LoginFormErrors.EMAIL_INVALID)).toBeVisible({ timeout: 10000 });

    // Valid email should clear error
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(1000); // Wait for onChange validation
    await expect(emailField.getByText(LoginFormErrors.EMAIL_INVALID)).not.toBeVisible();
  });

  /**
   * Tests password length validation requirements
   * Should enforce minimum 6 character requirement
   */
  test('should validate password length requirements', async ({ page }) => {
    const passwordField = page.getByTestId('signin-password-field');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Empty password
    await submitButton.click();
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_REQUIRED)).toBeVisible({ timeout: 10000 });

    // Too short password
    await passwordInput.fill('12345');
    await submitButton.click();
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_TOO_SHORT)).toBeVisible({ timeout: 10000 });

    // Valid password clears error
    await passwordInput.fill('password123');
    await page.waitForTimeout(1000);
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_TOO_SHORT)).not.toBeVisible();
  });

  /**
   * Tests password visibility toggle functionality
   * Should switch between hidden and visible password states
   */
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

  /**
   * Tests that multiple field errors can exist independently
   * Should show/hide errors for individual fields without affecting others
   */
  test('should handle multiple field errors independently', async ({ page }) => {
    const emailField = page.getByTestId('signin-email-field');
    const passwordField = page.getByTestId('signin-password-field');
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Fill both with invalid data
    await emailInput.fill('notanemail');
    await passwordInput.fill('123');
    await submitButton.click();

    // Both errors should show using enum values
    await expect(emailField.getByText(LoginFormErrors.EMAIL_INVALID)).toBeVisible({ timeout: 10000 });
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_TOO_SHORT)).toBeVisible({ timeout: 10000 });

    // Fix email only
    await emailInput.fill('test@example.com');
    await page.waitForTimeout(1000);

    // Email error clears, password error remains
    await expect(emailField.getByText(LoginFormErrors.EMAIL_INVALID)).not.toBeVisible();
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_TOO_SHORT)).toBeVisible({ timeout: 10000 });

    // Fix password
    await passwordInput.fill('password123');
    await page.waitForTimeout(1000);

    // Both errors cleared
    await expect(emailField.getByText(LoginFormErrors.EMAIL_INVALID)).not.toBeVisible();
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_TOO_SHORT)).not.toBeVisible();
  });

  /**
   * Tests successful form submission with valid credentials
   * Should navigate to dashboard upon successful login
   */
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

  /**
   * Tests interactive elements functionality
   * Including checkbox state and link attributes
   */
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

/**
 * Test suite for Sign In Page mobile functionality
 * Tests mobile-specific interactions and touch events
 */
test.describe('Sign In Page - Mobile', () => {
  /**
   * Configure mobile viewport and enable touch support
   */
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true
  });

  /**
   * Set up mobile test environment by navigating to sign-in page
   * and waiting for form to be ready
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('domcontentloaded');
    // Wait for the signin form to be visible instead of networkidle
    await page.getByTestId('signin-form').waitFor({ timeout: 15000 });
  });

  /**
   * Tests mobile form validation and submission using touch interactions
   * Should handle tap events and display validation errors appropriately
   */
  test('should work correctly on mobile', async ({ page }) => {
    const emailField = page.getByTestId('signin-email-field');
    const passwordField = page.getByTestId('signin-password-field');
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Test validation using enum values
    await submitButton.tap();
    await expect(emailField.getByText(LoginFormErrors.EMAIL_REQUIRED)).toBeVisible({ timeout: 10000 });
    await expect(passwordField.getByText(LoginFormErrors.PASSWORD_REQUIRED)).toBeVisible({ timeout: 10000 });

    // Fill and submit
    await emailInput.tap();
    await emailInput.fill('test@example.com');
    await passwordInput.tap();
    await passwordInput.fill('password123');
    await submitButton.tap();

    // Should navigate
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  /**
   * Tests password visibility toggle functionality on mobile devices
   * Should respond to tap events and change input type accordingly
   */
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