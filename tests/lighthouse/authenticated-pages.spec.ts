import { test, Page } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";

// Lighthouse thresholds
// Tests will fail if any score falls below these values
const thresholds = {
  performance: 80,
  accessibility: 90,
  "best-practices": 80,
  seo: 80,
};

// Login helper
async function login(page: Page) {
  await page.goto("http://localhost:3000/login");
  await page.fill('input[name="email"]', "katja@dwarf.dk");
  await page.fill('input[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/home");
}

test.describe("Lighthouse - Authenticated Pages", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Home page", async ({ page }) => {
    await page.goto("http://localhost:3000/home");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Profile page", async ({ page }) => {
    await page.goto("http://localhost:3000/profile");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Admin page", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Teams page", async ({ page }) => {
    await page.goto("http://localhost:3000/teams");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Create surveys page", async ({ page }) => {
    await page.goto("http://localhost:3000/manage-surveys");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Survey analytics page", async ({ page }) => {
    await page.goto("http://localhost:3000/survey-analytics");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });
});

test.describe("Lighthouse - Public Pages", () => {
  test("Landing page", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Login page", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Signup page", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });

  test("Company signup page", async ({ page }) => {
    await page.goto("http://localhost:3000/signup/company");
    await playAudit({
      page,
      thresholds,
      port: 9222,
    });
  });
});
