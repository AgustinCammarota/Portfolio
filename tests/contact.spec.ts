import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://api.emailjs.com/api/v1.0/email/send",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, message: "Mocked EmailJS response" }),
      });
    },
  );
  await page.route(
    "https://www.google.com/recaptcha/api/siteverify",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          message: "Mocked recaptcha response",
        }),
      });
    },
  );
  await page.route("*/**/_actions/email.sendEmail", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Mocked EmailJS action" }),
    });
  });
  await page.route("*/**/_actions/recaptcha.verifyCaptcha", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Mocked recaptcha action" }),
    });
  });
  await page.goto("/contact/");
  // Hidde astro-dev-toolbar
  await page.addStyleTag({
    content: "astro-dev-toolbar { display: none !important; }",
  });
  // Hide recaptcha
  await page.addStyleTag({
    content: ".grecaptcha-badge { display: none !important; }",
  });
});

test.describe("Contact Page", () => {
  test("Validate elements in the contact section", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:4321/contact/");
    await expect(
      page.getByRole("heading", { level: 1, name: "contact" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "I am open to freelance opportunities. If you have any other requests or questions, please feel free to reach out.",
      ),
    ).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
  });

  test("Should send the contact form", async ({ page }) => {
    await page.getByLabel("Email Address").fill("test@hotmail.com");
    await page.getByLabel("Subject").fill("TestSubject");
    await page.getByLabel("Message").fill("TestMessage");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForTimeout(500);
    await expect(
      page.getByRole("button", { name: "Please wait..." }),
    ).toBeVisible();
  });

  test("Visual comparisons", async ({ page }) => {
    await page.addStyleTag({
      content:
        "body { animation: none !important; transition: none !important; }",
    });
    await expect(page).toHaveScreenshot({
      maxDiffPixelRatio: 0.05,
    });
  });

  test("should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
