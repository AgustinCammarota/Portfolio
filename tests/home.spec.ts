import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
});

test.describe("Home Page", () => {
  test("Validate elements in the footer", async ({ page }) => {
    await expect(
      page.getByTitle("Access Agustín Cammarota's GitHub profile"),
    ).toBeVisible();
    await expect(
      page.getByTitle("Access Agustín Cammarota's Linkedin profile"),
    ).toBeVisible();
    await expect(
      page.getByTitle("Access Agustín Cammarota's Microsoft Outlook profile"),
    ).toBeVisible();
    await expect(
      page.getByTitle("Access Agustín Cammarota's WhatsApp profile"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Selected theme" }),
    ).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("Validate elements in the header", async ({ page }) => {
    await expect(page.getByTitle("Home")).toBeVisible();
    await expect(page.getByTitle("Works")).toBeVisible();
    await expect(page.getByTitle("Skills")).toBeVisible();
    await expect(page.getByTitle("Projects")).toBeVisible();
    await expect(page.getByTitle("Contact")).toBeVisible();
  });

  test("Validate elements in the home section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByAltText("Agustín Cammarota, Software Architect"),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Hey! My name is Agustín Cammarota and I work as a Software Architect",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Hey! I’m Agustin, a passionate software engineer with a solid academic background and extensive experience in the development of innovative technological solutions. With a proactive and results-oriented approach, I have dedicated my career to tackling complex challenges and finding efficient solutions that drive the success of projects.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "My experience spans from software design and development to the implementation of technological infrastructures, excelling in problem-solving and process optimization. I have worked in diverse environments, collaborating with multidisciplinary teams to achieve exceptional results!",
      ),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(page.getByText("Currently working at #Globant")).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: "Download Agustín Cammarota's CV in PDF",
      }),
    ).toBeVisible();
  });

  test("Should navigate to works section", async ({ page }) => {
    const worksLink = page.getByRole("link", { name: "Works" });
    await worksLink.click();
    await page.waitForURL("http://localhost:4321/works/");
    await expect(page).toHaveURL("http://localhost:4321/works/");
  });

  test("Should navigate to skills section", async ({ page }) => {
    const worksLink = page.getByRole("link", { name: "Skills" });
    await worksLink.click();
    await page.waitForURL("http://localhost:4321/skills/");
    await expect(page).toHaveURL("http://localhost:4321/skills/");
  });

  test("Should navigate to projects section", async ({ page }) => {
    const worksLink = page.getByRole("link", { name: "Projects" });
    await worksLink.click();
    await page.waitForURL("http://localhost:4321/projects/");
    await expect(page).toHaveURL("http://localhost:4321/projects/");
  });

  test("Should navigate to contact section", async ({ page }) => {
    const worksLink = page.getByRole("link", { name: "Contact" });
    await worksLink.click();
    await page.waitForURL("http://localhost:4321/contact/");
    await expect(page).toHaveURL("http://localhost:4321/contact/");
  });

  test("Should download the CV document", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    const downloadButton = page.getByRole("link", {
      name: "Download Agustín Cammarota's CV in PDF",
    });
    await downloadButton.click();
    const download = await downloadPromise;

    const filename = await download.suggestedFilename();
    expect(filename).toBe("agustin-cammarota-cv.pdf");

    const filePath = await download.path();
    expect(filePath).not.toBeNull();
  });

  test("Should open the GitHub URL", async ({ page, context }) => {
    const github = await page.getByTitle(
      "Access Agustín Cammarota's GitHub profile",
    );
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await github.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    const url = newPage.url();
    expect(url).toContain("github");
  });

  test("Should open the Linkedin URL", async ({ page, context }) => {
    const linkedin = await page.getByTitle(
      "Access Agustín Cammarota's Linkedin profile",
    );
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await linkedin.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    const url = newPage.url();
    expect(url).toContain("linkedin");
  });

  test("Should open the WhatsApp URL", async ({ page, context }) => {
    const whatsApp = await page.getByTitle(
      "Access Agustín Cammarota's WhatsApp profile",
    );
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await whatsApp.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    const url = newPage.url();
    expect(url).toContain("whatsapp");
  });

  test("Should change the selected theme", async ({ page }) => {
    let theme = await page.getAttribute("html", "data-theme");
    const themeBtn = page.getByRole("button", { name: "Selected theme" });
    expect(theme).toBe("dark");

    await themeBtn.click();

    theme = await page.getAttribute("html", "data-theme");

    expect(theme).toBe("light");
  });

  test("Should change the language", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/");
    const select = page.getByRole("combobox");
    await select.selectOption("es");
    await expect(page).toHaveURL("http://localhost:4321/es/");
  });

  test("Visual comparisons", async ({ page, browserName, viewport }) => {
    await page.addStyleTag({
      content:
        "body { animation: none !important; transition: none !important; }",
    });

    const deviceName = `${browserName}-${viewport?.width}x${viewport?.height}`;
    const screenshotName = `home-${deviceName}.png`;

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
