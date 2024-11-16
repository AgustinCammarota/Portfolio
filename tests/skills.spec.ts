import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/skills/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
});

test.describe("Skills Page", () => {
  test("Validate elements in the skills section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/skills/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Skills" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Languages" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Testing" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Frontend" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Backend" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Others" }),
    ).toBeVisible();
    expect((await page.getByRole("heading", { level: 2 }).all()).length).toBe(
      5,
    );
    expect(page.getByText("JavaScript").first()).toBeDefined();
    expect(page.getByText("TypeScript").first()).toBeDefined();
    expect(page.getByText("HTML").first()).toBeDefined();
    expect(page.getByText("CSS").first()).toBeDefined();
    expect(page.getByText("SQL").first()).toBeDefined();
    expect(page.getByText("Cucumber").first()).toBeDefined();
    expect(page.getByText("Jasmine").first()).toBeDefined();
    expect(page.getByText("Jest").first()).toBeDefined();
    expect(page.getByText("Puppeteer").first()).toBeDefined();
    expect(page.getByText("Selenium").first()).toBeDefined();
    expect(page.getByText("Webdriver").first()).toBeDefined();
    expect(page.getByText("Angular").first()).toBeDefined();
    expect(page.getByText("Astro").first()).toBeDefined();
    expect(page.getByText("Lit").first()).toBeDefined();
    expect(page.getByText("Solid").first()).toBeDefined();
    expect(page.getByText("PostgreSQL").first()).toBeDefined();
    expect(page.getByText("MongoDB").first()).toBeDefined();
    expect(page.getByText("RXJS").first()).toBeDefined();
    expect(page.getByText("Express").first()).toBeDefined();
    expect(page.getByText("Sass").first()).toBeDefined();
    expect(page.getByText("Storybook").first()).toBeDefined();
    expect(page.getByText("Tailwind").first()).toBeDefined();
    expect(page.getByText("Vite").first()).toBeDefined();
    expect(page.getByText("Webpack").first()).toBeDefined();
    expect(page.getByText("Turborepo").first()).toBeDefined();
    expect(page.getByText("NPM").first()).toBeDefined();
    expect(page.getByText("Redux").first()).toBeDefined();
    expect(page.getByText("Ionic").first()).toBeDefined();
    expect(page.getByText("Cordova").first()).toBeDefined();
    expect(page.getByText("ThreeJS").first()).toBeDefined();
    expect(page.getByText("Playwright").first()).toBeDefined();
  });

  test("Visual comparisons", async ({ page, browserName, viewport }) => {
    await page.addStyleTag({
      content:
        "body { animation: none !important; transition: none !important; }",
    });

    const deviceName = `${browserName}-${viewport?.width}x${viewport?.height}`;
    const screenshotName = `skills-${deviceName}.png`;

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
