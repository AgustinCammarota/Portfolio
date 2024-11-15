import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/projects/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
});

test.describe("Projects Page", () => {
  test("Validate elements in the projects section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/projects/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Design Systems" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Green Heat" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Portfolio" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Home Banking" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Hiring Insurance" }),
    ).toBeVisible();
    expect((await page.getByRole("heading", { level: 2 }).all()).length).toBe(
      5,
    );
    await expect(
      page.getByText(
        "Storybook Lit Turborepo HTML Sass JavaScript Jest Puppeteer Cucumber",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Angular RXJS HTML Sass Typescript Jasmine Puppeteer i18n SSR",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Astro SolidJS ThreeJS HTML Typescript CSS Vite i18n SSG"),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Lit Angular Cordova HTML Typescript Sass Jest Webdriver Selenium Cucumber",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Angular Ionic RXJS Redux Typescript HTML Sass Jasmine"),
    ).toBeVisible();
    await expect(
      page.getByText(
        "In this project, I developed a design system focused on web components, using Storybook and Lit as key technologies. This approach allowed me to create reusable and highly customizable components, facilitating collaboration and teamwork in development.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "In this project, I developed a landing page for a website offering climate control services. I used Angular as the main framework, leveraging the reactivity of RXJS and Signals to efficiently manage asynchronous data flows.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "In this project, I developed my portfolio with the goal of providing you with a better way to get to know me. I used technologies like Astro and Solid.js, leveraging their efficiency and flexibility to create a fast and modern web experience.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "In this project, I developed a home banking platform for both mobile devices and the web, adapted to different geographies. I used a set of key technologies that include Lit for creating web components, Angular as the main framework for the web part, Cordova for mobile app integration, and WebdriverIO for test automation. The solution focused on providing a unified and efficient experience for users from different regions.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "In this project, I developed a system for insurance enrollment available on both mobile and web platforms, using Angular and Ionic as the main technologies. This system enabled users to easily and efficiently manage their insurance purchases, ensuring an optimized user experience across both environments.",
      ),
    ).toBeVisible();
  });

  test("Should play de video", async ({ page }) => {
    await page.addStyleTag({
      content: "video { pointer-events: none !important; }",
    });
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width <= 768;
    const videoBtn = page.getByRole("button", { name: "Play" }).first();
    const video = page.locator("video").first();

    if (isMobile) {
      await videoBtn.click();
    } else {
      await videoBtn.hover();
    }

    const isPlaying = await video.evaluate(
      (vid: HTMLVideoElement) => !vid.paused,
    );

    expect(isPlaying).toBe(true);
  });

  test("Should pause de video", async ({ page }) => {
    await page.addStyleTag({
      content: "video { pointer-events: none !important; }",
    });
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width <= 768;
    const videoBtn = page.getByRole("button", { name: "Play" }).first();
    const video = page.locator("video").first();
    const outFocusElement = page.getByRole("heading", {
      level: 1,
      name: "Projects",
    });

    if (isMobile) {
      await videoBtn.click();
      await videoBtn.click();
    } else {
      await videoBtn.hover();
      await videoBtn.click();
      await page.addStyleTag({
        content: "video { pointer-events: auto !important; }",
      });
      await outFocusElement.click();
    }

    const isPlaying = await video.evaluate(
      (vid: HTMLVideoElement) => !vid.paused,
    );

    expect(isPlaying).toBe(false);
  });

  test("Should open the GitHub url with the project", async ({
    page,
    context,
  }) => {
    const gitHubLink = page.getByTitle("GitHub project link").first();
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await gitHubLink.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    const url = newPage.url();
    expect(url).toContain("github");
  });

  test("Should open the website url with the project", async ({
    page,
    context,
  }) => {
    const websiteLink = page.getByTitle("Website link").first();
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await websiteLink.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    const url = newPage.url();
    expect(url).toContain("https");
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
