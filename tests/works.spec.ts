import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/works/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
});

test.describe("Works Page", () => {
  test("Validate elements in the works section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/works/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Works Experience")).toBeVisible();
    await expect(
      page.getByText("Junior Software Architect at Globant"),
    ).toBeVisible();
    await expect(
      page.getByText("Senior Frontend Engineer at Globant"),
    ).toBeVisible();
    await expect(
      page.getByText("Ssr. Advanced Frontend Engineer at Globant"),
    ).toBeVisible();
    await expect(
      page.getByText("Ssr. Frontend Engineer at Globant"),
    ).toBeVisible();
    await expect(
      page.getByText("Ssr. Frontend Engineer at Gen IT"),
    ).toBeVisible();
    await expect(
      page.getByText("Full Stack Developer at Freelancer"),
    ).toBeVisible();
    expect((await page.getByRole("time").all()).length).toBe(6);
    expect((await page.getByRole("list").all()).length).toBe(8);
    expect((await page.getByRole("heading", { level: 2 }).all()).length).toBe(
      6,
    );
  });

  test("Should have company link on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/works/");
    const globantLink = page.getByTitle("Globant").first();
    await expect(globantLink).toBeVisible();
  });

  test("Should not have company link on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/works/");
    const globantLink = page.getByTitle("Globant").first();
    await expect(globantLink).toBeHidden();
  });

  test("Should open the Linkedin URL only on desktop viewport", async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/works/");
    const globantLink = page.getByTitle("Globant").first();
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await globantLink.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    const url = newPage.url();
    expect(url).toContain("linkedin");
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
