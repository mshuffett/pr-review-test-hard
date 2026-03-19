import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("home page loads and links to dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "screenshots/home-page.png",
      fullPage: true,
    });

    const dashboardLink = page.locator('a[href="/dashboard"]');
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toHaveText("Go to Dashboard");
  });

  test("dashboard page loads with data", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Wait for loading to finish
    await expect(page.locator("text=Loading dashboard data...")).not.toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: "screenshots/dashboard-loaded.png",
      fullPage: true,
    });

    // Verify the dashboard title
    await expect(page.locator("h1")).toHaveText("Dashboard");

    // Verify stats cards are rendered (use exact match to avoid "Revenue Trend")
    await expect(page.getByText("Revenue", { exact: true })).toBeVisible();
    await expect(page.getByText("Users", { exact: true })).toBeVisible();
    await expect(page.getByText("Orders", { exact: true })).toBeVisible();

    // Verify revenue trend section
    await expect(page.locator("text=Revenue Trend")).toBeVisible();
  });

  test("dashboard stats cards show correct data", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Loading dashboard data...")).not.toBeVisible({ timeout: 10000 });

    // Check that cards show formatted values (from mock API)
    // Revenue: $86,300
    await expect(page.locator("text=$86,300")).toBeVisible();
    // Users: 3,500
    await expect(page.locator("text=3,500")).toBeVisible();
    // Orders: 868
    await expect(page.locator("text=868")).toBeVisible();

    await page.screenshot({
      path: "screenshots/dashboard-stats-cards.png",
      fullPage: true,
    });
  });

  test("dashboard shows percentage changes", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Loading dashboard data...")).not.toBeVisible({ timeout: 10000 });

    // Verify percentage change indicators are visible
    // Revenue: (86300 - 72000) / 72000 * 100 = 19.9%
    await expect(page.locator("text=+19.9% vs previous period")).toBeVisible();

    await page.screenshot({
      path: "screenshots/dashboard-percentage-changes.png",
      fullPage: true,
    });
  });

  test("dashboard chart bars render", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Loading dashboard data...")).not.toBeVisible({ timeout: 10000 });

    // The chart should have bars (div elements with blue background)
    const chartBars = page.locator('div[style*="backgroundColor: #0070f3"], div[style*="background-color: rgb(0, 112, 243)"]');
    // We have 12 months of data
    const barCount = await chartBars.count();
    expect(barCount).toBeGreaterThanOrEqual(1);

    await page.screenshot({
      path: "screenshots/dashboard-chart.png",
      fullPage: true,
    });
  });

  test("navigating from home to dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "screenshots/nav-step1-home.png",
      fullPage: true,
    });

    await page.click('a[href="/dashboard"]');
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Loading dashboard data...")).not.toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: "screenshots/nav-step2-dashboard.png",
      fullPage: true,
    });

    await expect(page.locator("h1")).toHaveText("Dashboard");
  });
});
