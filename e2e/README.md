# End-to-End Tests

This directory contains end-to-end tests for the Portfolio Booking System using [Playwright](https://playwright.dev/).

## Overview

The e2e tests validate the complete application flow from the user's perspective, testing the interaction between the frontend and backend services.

## Structure

```
e2e/
├── tests/              # Test files
│   ├── navigation.spec.ts    # Navigation tests
│   └── locations.spec.ts     # Locations page tests
├── playwright.config.ts      # Playwright configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm
- Running backend and frontend services (or use docker-compose)

### Installation

```bash
cd e2e
pnpm install
pnpm exec playwright install
```

## Running Tests

### Run all tests

```bash
pnpm test
```

### Run tests in UI mode (interactive)

```bash
pnpm run test:ui
```

### Run tests in headed mode (see browser)

```bash
pnpm run test:headed
```

### Run tests in debug mode

```bash
pnpm run test:debug
```

### Run tests on specific browser

```bash
pnpm run test:chromium
pnpm run test:firefox
pnpm run test:webkit
pnpm run test:mobile
```

### View test report

```bash
pnpm run report
```

## Running with Docker Compose

To run e2e tests against the full stack using docker-compose:

```bash
# From the project root
docker-compose up -d

# Wait for services to be healthy
# Then run tests
cd e2e
BASE_URL=http://localhost:3000 pnpm test

# Cleanup
docker-compose down
```

## Test Configuration

### Environment Variables

- `BASE_URL` - Base URL of the application (default: `http://localhost:3000`)
- `CI` - Set to `true` in CI environments to enable:
  - Test retry on failure
  - Serial test execution
  - Junit reporter

### Playwright Config

Key configuration options in `playwright.config.ts`:

- **Projects**: Tests run on Chromium, Firefox, WebKit, and Mobile (iPhone 13)
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

## Writing Tests

### Best Practices

1. **Use Accessibility-First Selectors**
   ```typescript
   // Good - using role and accessible name
   await page.getByRole('button', { name: 'Submit' }).click();

   // Avoid - using CSS selectors
   await page.locator('.submit-btn').click();
   ```

2. **Test User Flows, Not Implementation**
   ```typescript
   // Good - testing user behavior
   test('user can navigate to bookings', async ({ page }) => {
     await page.goto('/');
     await page.getByRole('link', { name: /explore venues/i }).click();
     await expect(page).toHaveURL('/locations');
   });
   ```

3. **Handle Different States**
   ```typescript
   // Test loading, success, error, and empty states
   test('should handle API errors gracefully', async ({ page, context }) => {
     await context.route('**/api/locations**', route => route.abort());
     await expect(page.getByText(/error/i)).toBeVisible();
   });
   ```

4. **Use Page Object Pattern for Complex Pages**
   - For complex pages, create page objects in a `pages/` directory
   - Encapsulate page-specific selectors and actions

5. **Keep Tests Independent**
   - Each test should be able to run in isolation
   - Use `beforeEach` hooks for common setup
   - Clean up state after tests if needed

## Debugging

### Generate Test Code

Use Playwright's codegen to generate test code:

```bash
pnpm run codegen
```

### Debug Specific Test

```bash
pnpm exec playwright test navigation.spec.ts --debug
```

### View Traces

Traces are automatically collected on first retry. To view:

```bash
pnpm exec playwright show-trace test-results/*/trace.zip
```

## CI/CD Integration

E2E tests run automatically on pull requests and pushes to main via GitHub Actions (`.github/workflows/e2e-tests.yml`).

The workflow:
1. Starts PostgreSQL via docker-compose
2. Builds and runs the backend
3. Builds and runs the frontend
4. Executes Playwright tests
5. Uploads test reports and artifacts

## Test Coverage

Current test coverage:

- ✅ Homepage navigation to locations
- ✅ Locations page loading and display
- ✅ Error state handling
- ✅ Empty state handling
- ✅ API mocking and testing

## Future Tests

Planned test additions:
- Location details page
- Booking flow
- Form validation
- Authentication flows
- Mobile responsiveness
- Accessibility testing
