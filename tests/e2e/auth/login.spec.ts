import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should login successfully with valid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Fill in email field with test credentials from .env.test
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);

    // Fill in password field with test credentials from .env.test
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);

    // Click the submit button to attempt login
    await page.click('button[type="submit"]');

    // Verify successful login by checking redirect to home page
    await expect(page).toHaveURL("/home");
  });

  test("should show error with invalid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Attempt login with incorrect email
    await page.fill('input[type="email"]', "wrong@example.com");

    // Attempt login with incorrect password
    await page.fill('input[type="password"]', "wrongpassword");

    // Submit the form with wrong credentials
    await page.click('button[type="submit"]');

    // Verify user stays on login page (no redirect)
    await expect(page).toHaveURL("/login");

    // Verify error message is displayed
    // Using regex /i flag for case-insensitive matching
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    // Login first to have an authenticated session
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');

    // Verify successful login before attempting logout
    await expect(page).toHaveURL("/home");

    // Wait for sidebar to be fully loaded and enabled
    await page.waitForLoadState("networkidle");

    // Click on sidebar menu button to open dropdown using test id
    await page.getByTestId("sidebar-menu-button").click();

    // Click "Sign out" option in the dropdown menu
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Verify successful logout - user should be redirected back to login page
    await expect(page).toHaveURL("/login");
  });

  test("should not allow access to protected routes after logout", async ({
    page,
  }) => {
    // Login first to establish session
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/home");

    // Logout to destroy session
    await page.waitForLoadState("networkidle");
    await page.getByTestId("sidebar-menu-button").click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await expect(page).toHaveURL("/login");

    // Try to access protected route - should redirect to login
    // This verifies session is properly destroyed
    await page.goto("/home");
    await expect(page).toHaveURL("/login?redirect=%2Fhome");

    // Try another protected route to be thorough
    await page.goto("/profile");
    await expect(page).toHaveURL("/login?redirect=%2Fprofile");
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Attempt to submit form without filling any fields
    await page.click('button[type="submit"]');

    // Verify validation error message appears
    // Form should prevent submission and display required field error
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });
});
