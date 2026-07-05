import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/"];

test.describe("public routes", () => {
  for (const route of routes) {
    test(`${route} renders without critical accessibility violations`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
          }
        `,
      });

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

test("home route exposes the reusable message form", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /reusable contact path/i }),
  ).toBeVisible();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Message")).toBeVisible();
});
