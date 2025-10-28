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
      const logo = page.locator('img[alt="Portfolio Booking"]');
      await expect(logo).toBeVisible();

      // Verify form elements are present
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toHaveText('Sign in');
    });

    test('should display social login buttons', async ({ page }) => {
      const googleButton = page.locator('button:has-text("Google")');
      const githubButton = page.locator('button:has-text("GitHub")');

      await expect(googleButton).toBeVisible();
      await expect(githubButton).toBeVisible();
    });

    test('should display sign up link', async ({ page }) => {
      const signUpLink = page.locator('a[href="/signup"]');
      await expect(signUpLink).toBeVisible();
      await expect(signUpLink).toHaveText('Sign up');
    });
  });

  test.describe('Email Field Validation', () => {
    test('should show error when email field is empty and blurred', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Focus and blur without entering anything
      await emailInput.focus();
      await emailInput.blur();

      // Wait for error message to appear
      const errorMessage = page.locator('text=Email is required');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });

      // Verify input has error styling (invalid state)
      const inputWrapper = emailInput.locator('..');
      await expect(inputWrapper).toHaveAttribute('data-invalid', 'true');
    });

    test('should show error when email format is invalid', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Enter invalid email format
      await emailInput.fill('notanemail');
      await emailInput.blur();

      // Wait for error message
      const errorMessage = page.locator('text=Please enter a valid email address');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
    });

    test('should show error for invalid email with @ but no domain', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      await emailInput.fill('test@');
      await emailInput.blur();

      const errorMessage = page.locator('text=Please enter a valid email address');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
    });

    test('should clear error when valid email is entered', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // First trigger error
      await emailInput.focus();
      await emailInput.blur();

      const errorMessage = page.locator('text=Email is required');
      await expect(errorMessage).toBeVisible();

      // Now enter valid email
      await emailInput.fill('test@example.com');

      // Error should disappear
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 });
    });

    test('should validate email in real-time after first error', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Trigger validation
      await emailInput.fill('invalid');
      await emailInput.blur();

      const errorMessage = page.locator('text=Please enter a valid email address');
      await expect(errorMessage).toBeVisible();

      // Start typing valid email - error should update in real-time
      await emailInput.fill('test@example.com');

      // Error should clear without needing to blur
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Password Field Validation', () => {
    test('should show error when password field is empty and blurred', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');

      await passwordInput.focus();
      await passwordInput.blur();

      const errorMessage = page.locator('text=Password is required');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
    });

    test('should show error when password is less than 6 characters', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');

      await passwordInput.fill('12345');
      await passwordInput.blur();

      const errorMessage = page.locator('text=Password must be at least 6 characters');
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
    });

    test('should clear error when password meets minimum length', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');

      // First trigger error
      await passwordInput.fill('123');
      await passwordInput.blur();

      const errorMessage = page.locator('text=Password must be at least 6 characters');
      await expect(errorMessage).toBeVisible();

      // Now enter valid password
      await passwordInput.fill('123456');

      // Error should disappear
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 });
    });

    test('should toggle password visibility', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');
      const toggleButton = page.locator('button:has(svg)').nth(0); // Eye icon button

      // Verify password is initially hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Click toggle to show password
      await toggleButton.click();

      // Wait a moment for the state to update
      await page.waitForTimeout(100);

      // Password should now be visible as text input
      const visibleInput = page.locator('input[type="text"]').first();
      await expect(visibleInput).toBeVisible();
    });
  });

  test.describe('Form Submission Validation', () => {
    test('should prevent submission with empty form', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]');

      await submitButton.click();

      // Both error messages should appear
      const emailError = page.locator('text=Email is required');
      const passwordError = page.locator('text=Password is required');

      await expect(emailError).toBeVisible({ timeout: 2000 });
      await expect(passwordError).toBeVisible({ timeout: 2000 });

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with only email filled', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill('test@example.com');
      await submitButton.click();

      // Only password error should appear
      const passwordError = page.locator('text=Password is required');
      await expect(passwordError).toBeVisible({ timeout: 2000 });

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with only password filled', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await passwordInput.fill('password123');
      await submitButton.click();

      // Only email error should appear
      const emailError = page.locator('text=Email is required');
      await expect(emailError).toBeVisible({ timeout: 2000 });

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with invalid email format', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill('notanemail');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Email format error should appear
      const emailError = page.locator('text=Please enter a valid email address');
      await expect(emailError).toBeVisible({ timeout: 2000 });

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should prevent submission with short password', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('12345');
      await submitButton.click();

      // Password length error should appear
      const passwordError = page.locator('text=Password must be at least 6 characters');
      await expect(passwordError).toBeVisible({ timeout: 2000 });

      // Should still be on sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('should show loading state during submission', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      // Click submit
      await submitButton.click();

      // Button should show loading state
      await expect(submitButton).toHaveText('Signing in...');
      await expect(submitButton).toBeDisabled();
    });

    test('should allow submission with valid credentials', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Should navigate to dashboard (mocked in the component)
      await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
    });
  });

  test.describe('Multiple Field Validation', () => {
    test('should show all errors when multiple fields are invalid', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      // Fill both with invalid data
      await emailInput.fill('notanemail');
      await passwordInput.fill('123');

      // Blur both fields
      await emailInput.blur();
      await passwordInput.blur();

      // Both errors should be visible
      const emailError = page.locator('text=Please enter a valid email address');
      const passwordError = page.locator('text=Password must be at least 6 characters');

      await expect(emailError).toBeVisible({ timeout: 2000 });
      await expect(passwordError).toBeVisible({ timeout: 2000 });
    });

    test('should clear errors independently when fixed', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      // Fill both with invalid data
      await emailInput.fill('notanemail');
      await passwordInput.fill('123');
      await emailInput.blur();
      await passwordInput.blur();

      const emailError = page.locator('text=Please enter a valid email address');
      const passwordError = page.locator('text=Password must be at least 6 characters');

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

  test.describe('Accessibility and UX', () => {
    test('should have accessible form labels', async ({ page }) => {
      // Email input should have label
      const emailLabel = page.locator('label:has-text("Email")');
      await expect(emailLabel).toBeVisible();

      // Password input should have label
      const passwordLabel = page.locator('label:has-text("Password")');
      await expect(passwordLabel).toBeVisible();
    });

    test('should have remember me checkbox', async ({ page }) => {
      const rememberMeCheckbox = page.locator('input[type="checkbox"]');
      const rememberMeLabel = page.locator('text=Remember me');

      await expect(rememberMeCheckbox).toBeVisible();
      await expect(rememberMeLabel).toBeVisible();
    });

    test('should have forgot password link', async ({ page }) => {
      const forgotPasswordLink = page.locator('a[href="/forgot-password"]');
      await expect(forgotPasswordLink).toBeVisible();
      await expect(forgotPasswordLink).toHaveText('Forgot password?');
    });

    test('should focus email field first on page load', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');

      // Click somewhere else first to ensure clean state
      await page.locator('body').click();

      // Tab to focus first input
      await page.keyboard.press('Tab');

      // Email input should be focusable via keyboard
      await expect(emailInput).toBeFocused();
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
    const logo = page.locator('img[alt="Portfolio Booking"]');
    await expect(logo).toBeVisible();

    // Form should be visible and properly sized
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors on mobile when fields are empty', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Tap and leave fields
    await emailInput.tap();
    await passwordInput.tap();
    await emailInput.tap(); // Tap back to blur password

    // Wait for validation
    await page.waitForTimeout(500);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.tap();

    // Errors should be visible on mobile
    const emailError = page.locator('text=Email is required');
    const passwordError = page.locator('text=Password is required');

    await expect(emailError).toBeVisible({ timeout: 2000 });
    await expect(passwordError).toBeVisible({ timeout: 2000 });
  });

  test('should show error when invalid email is entered on mobile', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    await emailInput.tap();
    await emailInput.fill('notanemail');

    // Tap submit to trigger validation
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.tap();

    const errorMessage = page.locator('text=Please enter a valid email address');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should show error when short password is entered on mobile', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');

    await passwordInput.tap();
    await passwordInput.fill('123');

    // Tap submit to trigger validation
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.tap();

    const errorMessage = page.locator('text=Password must be at least 6 characters');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
  });

  test('should toggle password visibility on mobile', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button:has(svg)').nth(0);

    await passwordInput.tap();
    await passwordInput.fill('password123');

    // Tap toggle button
    await toggleButton.tap();

    // Password should be visible
    await page.waitForTimeout(100);
    const visibleInput = page.locator('input[type="text"]').first();
    await expect(visibleInput).toBeVisible();
  });

  test('should allow valid form submission on mobile', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await emailInput.tap();
    await emailInput.fill('test@example.com');

    await passwordInput.tap();
    await passwordInput.fill('password123');

    await submitButton.tap();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
  });

  test('should display error messages below inputs on mobile', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    await emailInput.tap();
    await submitButton.tap();

    const errorMessage = page.locator('text=Email is required');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });

    // Get positions to verify error is below input
    const inputBox = await emailInput.boundingBox();
    const errorBox = await errorMessage.boundingBox();

    if (inputBox && errorBox) {
      // Error message should be positioned below the input
      expect(errorBox.y).toBeGreaterThan(inputBox.y);
    }
  });
});
