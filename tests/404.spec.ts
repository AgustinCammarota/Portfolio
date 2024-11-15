import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/404/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
});

test.describe("404 Page", () => {
  test("Validate elements in the 404 section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/404/");
    await expect(
      page.getByRole("heading", { level: 1, name: "4☹4" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Ops, page not found." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  });

  test("Should navigate to home page", async ({ page }) => {
    const btn = page.getByRole("link", { name: "Home" });
    await btn.click();
    await page.waitForURL("http://localhost:4321/");
    await expect(page).toHaveURL("http://localhost:4321/");
  });

  test("Visual comparisons", async ({ page }) => {
    await expect(page).toHaveScreenshot();
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
