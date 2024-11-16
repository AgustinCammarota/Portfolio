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
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width <= 768;
    const globantLink = page.getByTitle("Globant").first();

    if (!isMobile) {
      await globantLink.scrollIntoViewIfNeeded();
      await expect(globantLink).toBeVisible();
    } else {
      await expect(globantLink).toBeHidden();
    }
  });

  test("Should open the Linkedin URL only on desktop viewport", async ({
    page,
    context,
  }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width <= 768;
    const globantLink = page.getByTitle("Globant").first();

    if (!isMobile) {
      await globantLink.scrollIntoViewIfNeeded();

      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        await globantLink.click(),
      ]);

      await newPage.waitForLoadState("domcontentloaded");
      const url = newPage.url();
      expect(url).toContain("linkedin");
    } else {
      await expect(globantLink).toBeHidden();
    }
  });

  test("Visual comparisons", async ({ page, browserName, viewport }) => {
    await page.addStyleTag({
      content:
        "body { animation: none !important; transition: none !important; }",
    });

    const deviceName = `${browserName}-${viewport?.width}x${viewport?.height}`;
    const screenshotName = `works-${deviceName}.png`;

    await expect(page).toHaveScreenshot(screenshotName, {
      maxDiffPixelRatio: 0.1,
    });
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
