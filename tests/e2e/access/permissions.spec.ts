import { test, expect } from "@playwright/test";

test.describe("Role-Based Access Control", () => {
  test("unauthenticated user redirects to login", async ({ page }) => {
    // Try to access protected route without login
    await page.goto("/home");

    // Should redirect to login page
    await expect(page).toHaveURL("/login?redirect=%2Fhome");
  });

  test("employee cannot access admin routes", async ({ page }) => {
    // Login as employee
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');

    // Try to access admin route
    await page.goto("/admin");

    // Should not be on admin page (redirect or error)
    await expect(page).not.toHaveURL("/admin");
  });

  test("admin can access admin routes", async ({ page }) => {
    // Login as admin
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_ADMIN_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD!);
    await page.click('button[type="submit"]');

    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL("/home");

    // Access admin route
    await page.goto("/admin");

    // Should successfully access admin page
    await expect(page).toHaveURL("/admin");
    await expect(
      page.getByRole("heading", { name: /manage users/i })
    ).toBeVisible();
  });
});
