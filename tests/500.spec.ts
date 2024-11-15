import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/500/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
});

test.describe("500 Page", () => {
  test("Validate elements in the 500 section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/500/");
    await expect(
      page.getByRole("heading", { level: 1, name: "5☹5" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Sorry, it's me not you." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Let me try again!" }),
    ).toBeVisible();
  });

  test("Should navigate to home page", async ({ page }) => {
    const btn = page.getByRole("link", { name: "Let me try again!" });
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
