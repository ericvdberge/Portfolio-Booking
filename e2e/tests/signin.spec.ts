import { test, expect } from '@playwright/test';

test.describe('Sign In Page - Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign in page before each test
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Layout', () => {
    test('should display sign in page with logo and form', async ({ page }) => {
      // Verify logo is visible
      const logo = page.getByTestId('signin-logo');
      await expect(logo).toBeVisible();

      // Verify form elements are present
      const form = page.getByTestId('signin-form');
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await expect(form).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    test('should display social login buttons', async ({ page }) => {
      const googleButton = page.getByTestId('signin-google-button');
      const githubButton = page.getByTestId('signin-github-button');

      await expect(googleButton).toBeVisible();
      await expect(githubButton).toBeVisible();
    });

    test('should display sign up link', async ({ page }) => {
      const signUpLink = page.getByTestId('signin-signup-link');
      await expect(signUpLink).toBeVisible();
    });

    test('should display remember me checkbox', async ({ page }) => {
      const rememberMe = page.getByTestId('signin-remember-me');
      await expect(rememberMe).toBeVisible();
    });

    test('should display forgot password link', async ({ page }) => {
      const forgotPasswordLink = page.getByTestId('signin-forgot-password-link');
      await expect(forgotPasswordLink).toBeVisible();
    });
  });

  test.describe('Email Field Validation', () => {
    test('should show error when email field is empty and blurred', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');

      // Focus and blur without entering anything
      await emailInput.focus();
      await emailInput.blur();

      // Wait for error message to appear
      const errorMessage = page.getByTestId('signin-email-error');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
      await expect(errorMessage).toHaveText('Email is required');
    });

    test('should show error when email format is invalid', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');

      // Enter invalid email format
      await emailInput.fill('notanemail');
      await emailInput.blur();

      // Wait for error message
      const errorMessage = page.getByTestId('signin-email-error');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
      await expect(errorMessage).toHaveText('Please enter a valid email address');
    });

    test('should show error for invalid email with @ but no domain', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');

      await emailInput.fill('test@');
      await emailInput.blur();

      const errorMessage = page.getByTestId('signin-email-error');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
      await expect(errorMessage).toHaveText('Please enter a valid email address');
    });

    test('should clear error when valid email is entered', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');

      // First trigger error
      await emailInput.focus();
      await emailInput.blur();

      const errorMessage = page.getByTestId('signin-email-error');
      await expect(errorMessage).toBeVisible();

      // Now enter valid email
      await emailInput.fill('test@example.com');

      // Error should disappear
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 });
    });

    test('should validate email in real-time after first error', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');

      // Trigger validation
      await emailInput.fill('invalid');
      await emailInput.blur();

      const errorMessage = page.getByTestId('signin-email-error');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveText('Please enter a valid email address');

      // Start typing valid email - error should update in real-time
      await emailInput.fill('test@example.com');

      // Error should clear without needing to blur
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Password Field Validation', () => {
    test('should show error when password field is empty and blurred', async ({ page }) => {
      const passwordInput = page.getByTestId('signin-password-input');

      await passwordInput.focus();
      await passwordInput.blur();

      const errorMessage = page.getByTestId('signin-password-error');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
      await expect(errorMessage).toHaveText('Password is required');
    });

    test('should show error when password is less than 6 characters', async ({ page }) => {
      const passwordInput = page.getByTestId('signin-password-input');

      await passwordInput.fill('12345');
      await passwordInput.blur();

      const errorMessage = page.getByTestId('signin-password-error');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
      await expect(errorMessage).toHaveText('Password must be at least 6 characters');
    });

    test('should clear error when password meets minimum length', async ({ page }) => {
      const passwordInput = page.getByTestId('signin-password-input');

      // First trigger error
      await passwordInput.fill('123');
      await passwordInput.blur();

      const errorMessage = page.getByTestId('signin-password-error');
      await expect(errorMessage).toBeVisible();

      // Now enter valid password
      await passwordInput.fill('123456');

      // Error should disappear
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 });
    });

    test('should toggle password visibility', async ({ page }) => {
      const passwordInput = page.getByTestId('signin-password-input');
      const toggleButton = page.getByTestId('signin-password-toggle');

      // Fill in password
      await passwordInput.fill('password123');

      // Verify password is initially hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Click toggle to show password
      await toggleButton.click();

      // Wait a moment for the state to update
      await page.waitForTimeout(100);

      // Password should now be visible as text input
      await expect(passwordInput).toHaveAttribute('type', 'text');

      // Click toggle again to hide password
      await toggleButton.click();
      await page.waitForTimeout(100);

      // Password should be hidden again
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Form Submission Validation', () => {
    test('should prevent submission with empty form', async ({ page }) => {
      const submitButton = page.getByTestId('signin-submit-button');

      await submitButton.click();

      // Both error messages should appear
      const emailError = page.getByTestId('signin-email-error');
      const passwordError = page.getByTestId('signin-password-error');

      await expect(emailError).toBeVisible({ timeout: 2000 });
      await expect(passwordError).toBeVisible({ timeout: 2000 });

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with only email filled', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await emailInput.fill('test@example.com');
      await submitButton.click();

      // Only password error should appear
      const passwordError = page.getByTestId('signin-password-error');
      await expect(passwordError).toBeVisible({ timeout: 2000 });
      await expect(passwordError).toHaveText('Password is required');

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with only password filled', async ({ page }) => {
      const passwordInput = page.getByTestId('signin-password-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await passwordInput.fill('password123');
      await submitButton.click();

      // Only email error should appear
      const emailError = page.getByTestId('signin-email-error');
      await expect(emailError).toBeVisible({ timeout: 2000 });
      await expect(emailError).toHaveText('Email is required');

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with invalid email format', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await emailInput.fill('notanemail');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Email format error should appear
      const emailError = page.getByTestId('signin-email-error');
      await expect(emailError).toBeVisible({ timeout: 2000 });
      await expect(emailError).toHaveText('Please enter a valid email address');

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with short password', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('12345');
      await submitButton.click();

      // Password length error should appear
      const passwordError = page.getByTestId('signin-password-error');
      await expect(passwordError).toBeVisible({ timeout: 2000 });
      await expect(passwordError).toHaveText('Password must be at least 6 characters');

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should show loading state during submission', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      // Click submit
      await submitButton.click();

      // Button should be disabled immediately
      await expect(submitButton).toBeDisabled();
    });

    test('should allow submission with valid credentials', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');
      const submitButton = page.getByTestId('signin-submit-button');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Should navigate to dashboard (mocked in the component)
      await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
    });
  });

  test.describe('Multiple Field Validation', () => {
    test('should show all errors when multiple fields are invalid', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');

      // Fill both with invalid data
      await emailInput.fill('notanemail');
      await passwordInput.fill('123');

      // Blur both fields
      await emailInput.blur();
      await passwordInput.blur();

      // Both errors should be visible
      const emailError = page.getByTestId('signin-email-error');
      const passwordError = page.getByTestId('signin-password-error');

      await expect(emailError).toBeVisible({ timeout: 2000 });
      await expect(emailError).toHaveText('Please enter a valid email address');
      await expect(passwordError).toBeVisible({ timeout: 2000 });
      await expect(passwordError).toHaveText('Password must be at least 6 characters');
    });

    test('should clear errors independently when fixed', async ({ page }) => {
      const emailInput = page.getByTestId('signin-email-input');
      const passwordInput = page.getByTestId('signin-password-input');

      // Fill both with invalid data
      await emailInput.fill('notanemail');
      await passwordInput.fill('123');
      await emailInput.blur();
      await passwordInput.blur();

      const emailError = page.getByTestId('signin-email-error');
      const passwordError = page.getByTestId('signin-password-error');

      // Verify both errors exist
      await expect(emailError).toBeVisible();
      await expect(passwordError).toBeVisible();

      // Fix email only
      await emailInput.fill('test@example.com');

      // Email error should clear, password error should remain
      await expect(emailError).not.toBeVisible({ timeout: 2000 });
      await expect(passwordError).toBeVisible();

      // Fix password
      await passwordInput.fill('password123');

      // Password error should also clear
      await expect(passwordError).not.toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Navigation Links', () => {
    test('should have working forgot password link', async ({ page }) => {
      const forgotPasswordLink = page.getByTestId('signin-forgot-password-link');
      await expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    });

    test('should have working sign up link', async ({ page }) => {
      const signUpLink = page.getByTestId('signin-signup-link');
      await expect(signUpLink).toHaveAttribute('href', '/signup');
    });

    test('should have working logo link to home', async ({ page }) => {
      const logoLink = page.getByTestId('signin-logo-link');
      await expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  test.describe('Interactive Elements', () => {
    test('should have functional remember me checkbox', async ({ page }) => {
      const rememberMeCheckbox = page.getByTestId('signin-remember-me');

      // Initially unchecked
      await expect(rememberMeCheckbox).not.toBeChecked();

      // Click to check
      await rememberMeCheckbox.click();
      await expect(rememberMeCheckbox).toBeChecked();

      // Click again to uncheck
      await rememberMeCheckbox.click();
      await expect(rememberMeCheckbox).not.toBeChecked();
    });

    test('should have google login button', async ({ page }) => {
      const googleButton = page.getByTestId('signin-google-button');
      await expect(googleButton).toBeEnabled();
      await expect(googleButton).toBeVisible();
    });

    test('should have github login button', async ({ page }) => {
      const githubButton = page.getByTestId('signin-github-button');
      await expect(githubButton).toBeEnabled();
      await expect(githubButton).toBeVisible();
    });
  });
});

test.describe('Sign In Page - Mobile Validation', () => {
  test.use({
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
  });

  test('should display mobile layout correctly', async ({ page }) => {
    // Logo should be visible on mobile
    const logo = page.getByTestId('signin-logo');
    await expect(logo).toBeVisible();

    // Form should be visible and properly sized
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors on mobile when fields are empty', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    // Tap and leave fields
    await emailInput.tap();
    await passwordInput.tap();

    // Submit to trigger validation
    await submitButton.tap();

    // Errors should be visible on mobile
    const emailError = page.getByTestId('signin-email-error');
    const passwordError = page.getByTestId('signin-password-error');

    await expect(emailError).toBeVisible({ timeout: 2000 });
    await expect(passwordError).toBeVisible({ timeout: 2000 });
  });

  test('should show error when invalid email is entered on mobile', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const submitButton = page.getByTestId('signin-submit-button');

    await emailInput.tap();
    await emailInput.fill('notanemail');

    // Tap submit to trigger validation
    await submitButton.tap();

    const errorMessage = page.getByTestId('signin-email-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
    await expect(errorMessage).toHaveText('Please enter a valid email address');
  });

  test('should show error when short password is entered on mobile', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    await passwordInput.tap();
    await passwordInput.fill('123');

    // Tap submit to trigger validation
    await submitButton.tap();

    const errorMessage = page.getByTestId('signin-password-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
    await expect(errorMessage).toHaveText('Password must be at least 6 characters');
  });

  test('should toggle password visibility on mobile', async ({ page }) => {
    const passwordInput = page.getByTestId('signin-password-input');
    const toggleButton = page.getByTestId('signin-password-toggle');

    await passwordInput.tap();
    await passwordInput.fill('password123');

    // Verify password is hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Tap toggle button
    await toggleButton.tap();
    await page.waitForTimeout(100);

    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Tap toggle again
    await toggleButton.tap();
    await page.waitForTimeout(100);

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should allow valid form submission on mobile', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const passwordInput = page.getByTestId('signin-password-input');
    const submitButton = page.getByTestId('signin-submit-button');

    await emailInput.tap();
    await emailInput.fill('test@example.com');

    await passwordInput.tap();
    await passwordInput.fill('password123');

    await submitButton.tap();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
  });

  test('should display error messages below inputs on mobile', async ({ page }) => {
    const emailInput = page.getByTestId('signin-email-input');
    const submitButton = page.getByTestId('signin-submit-button');

    await emailInput.tap();
    await submitButton.tap();

    const errorMessage = page.getByTestId('signin-email-error');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });

    // Get positions to verify error is below input
    const inputBox = await emailInput.boundingBox();
    const errorBox = await errorMessage.boundingBox();

    if (inputBox && errorBox) {
      // Error message should be positioned below the input
      expect(errorBox.y).toBeGreaterThan(inputBox.y);
    }
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    const submitButton = page.getByTestId('signin-submit-button');
    const googleButton = page.getByTestId('signin-google-button');
    const githubButton = page.getByTestId('signin-github-button');

    // All buttons should be visible and tappable
    await expect(submitButton).toBeVisible();
    await expect(googleButton).toBeVisible();
    await expect(githubButton).toBeVisible();

    // Buttons should have adequate size for touch interaction
    const submitBox = await submitButton.boundingBox();
    if (submitBox) {
      // Button should be at least 44px tall (iOS touch target guideline)
      expect(submitBox.height).toBeGreaterThanOrEqual(40);
    }
  });
});
