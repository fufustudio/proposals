import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const publicRoutes = ["/", "/proposals/sample-proposal/access"];
const proposalLayoutViewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1180, height: 800 },
  { width: 1365, height: 900 },
  { width: 1440, height: 900 },
  { width: 1728, height: 1117 },
  { width: 2560, height: 1440 },
];
const proposalLayoutTargets = [
  { id: "direction", heading: "Likely direction", label: /likely direction/i },
  {
    id: "timeline",
    heading: "Process & timeline",
    label: /process & timeline/i,
  },
  { id: "next-steps", heading: "Next steps", label: /next steps/i },
];

test.describe("public routes", () => {
  for (const route of publicRoutes) {
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

test("home route renders the proposal scaffold", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /private proposal workspace/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /demo proposal access is wired/i }),
  ).toBeVisible();
  await expect(page.getByText(/reusable contact path/i)).toHaveCount(0);
});

test("proposal detail redirects to access when locked", async ({ page }) => {
  await page.goto("/proposals/sample-proposal");

  await expect(page).toHaveURL(/\/proposals\/sample-proposal\/access/);
  await expect(page.getByLabel("Proposal password")).toBeVisible();
});

test("wrong password keeps the visitor on the access flow", async ({
  page,
}) => {
  await page.goto("/proposals/sample-proposal/access");
  await page.getByLabel("Proposal password").fill("wrong");
  await page.getByRole("button", { name: /view proposal/i }).click();

  await expect(page).toHaveURL(/error=invalid/);
  await expect(
    page.getByText(/that password did not unlock this proposal/i),
  ).toBeVisible();
});

test("correct password unlocks the demo proposal", async ({ page }) => {
  await unlockSampleProposal(page);

  await expect(page).toHaveURL(/\/proposals\/sample-proposal$/);
  await expect(
    page.getByRole("heading", { name: "Sample Proposal" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /process & timeline/i }),
  ).toBeVisible();
});

test("desktop rail navigation and progress track the proposal sections", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) < 1180,
    "Rail navigation is desktop-only.",
  );

  await unlockSampleProposal(page);

  const progress = page.getByTestId("proposal-progress");
  const before = await progress.evaluate((node) =>
    Number.parseFloat(
      getComputedStyle(node.parentElement as HTMLElement).getPropertyValue(
        "--proposal-progress",
      ),
    ),
  );

  await page
    .getByRole("navigation", { name: "Proposal sections" })
    .getByRole("link", { name: /process & timeline/i })
    .click();
  await expect(page).toHaveURL(/#timeline$/);
  await expect(
    page.getByRole("heading", { name: /process & timeline/i }),
  ).toBeInViewport();

  const after = await progress.evaluate((node) =>
    Number.parseFloat(
      getComputedStyle(node.parentElement as HTMLElement).getPropertyValue(
        "--proposal-progress",
      ),
    ),
  );

  expect(after).toBeGreaterThan(before);
});

test("keyboard navigation moves between proposal sections", async ({
  page,
}) => {
  await unlockSampleProposal(page);
  await disableMotion(page);

  await page.keyboard.press("ArrowDown");
  await expect(page).toHaveURL(/#understand$/);

  await page.keyboard.press("End");
  await expect(page).toHaveURL(/#next-steps$/);

  await page.keyboard.press("Home");
  await expect(page).toHaveURL(/#cover$/);

  await page.keyboard.press("PageDown");
  await expect(page).toHaveURL(/#understand$/);

  await page.keyboard.press("Shift+Space");
  await expect(page).toHaveURL(/#cover$/);
});

test("proposal drawers expand independently from the section title column", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1365, height: 900 });
  await unlockSampleProposal(page);
  await disableMotion(page);

  await page
    .getByRole("navigation", { name: "Proposal sections" })
    .getByRole("link", { name: /what's included/i })
    .click();
  await expect(
    page.getByRole("heading", { name: "What's included" }),
  ).toBeInViewport();

  const heading = page.getByRole("heading", { name: "What's included" });
  const summary = page.locator("summary", { hasText: "Included item A" });
  const details = page.locator("details", { has: summary });
  const headingTop = await heading.evaluate(
    (node) => node.getBoundingClientRect().top,
  );
  const beforeTop = await summary.evaluate(
    (node) => node.getBoundingClientRect().top,
  );

  await summary.click();
  await expect(details).toHaveAttribute("open", "");
  await expect
    .poll(async () => {
      const nextTop = await summary.evaluate(
        (node) => node.getBoundingClientRect().top,
      );

      return Math.abs(nextTop - beforeTop);
    })
    .toBeLessThan(2);
  await expect
    .poll(async () => {
      const nextHeadingTop = await heading.evaluate(
        (node) => node.getBoundingClientRect().top,
      );

      return Math.abs(nextHeadingTop - headingTop);
    })
    .toBeLessThan(2);
});

test("proposal layout is stable across responsive viewport matrix", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "The matrix sets explicit viewport sizes and only needs one browser engine.",
  );

  await page.setViewportSize(proposalLayoutViewports[0]);
  await unlockSampleProposal(page);

  for (const viewport of proposalLayoutViewports) {
    await page.setViewportSize(viewport);

    for (const target of proposalLayoutTargets) {
      if (viewport.width >= 1180) {
        await page
          .getByRole("navigation", { name: "Proposal sections" })
          .getByRole("link", { name: target.label })
          .click();
      } else {
        await page.goto("/proposals/sample-proposal");
        await page.evaluate((sectionId) => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ block: "center" });
          window.history.replaceState(null, "", `#${sectionId}`);
        }, target.id);
      }

      await disableMotion(page);
      await expect(page).toHaveURL(new RegExp(`#${target.id}$`));
      await expect(
        page.locator(`#${target.id}`).getByRole("heading", {
          name: target.heading,
        }),
      ).toBeInViewport();

      const layout = await page.evaluate((sectionId) => {
        const rail = document.querySelector(
          'nav[aria-label="Proposal sections"]',
        );
        const section = document.getElementById(sectionId);
        const railRect = rail?.getBoundingClientRect();
        const railStyle = rail ? getComputedStyle(rail) : null;
        const railVisible = Boolean(
          rail &&
          railRect &&
          railStyle?.display !== "none" &&
          railRect.width > 0 &&
          railRect.height > 0,
        );
        const overlap = (left: DOMRect, right: DOMRect) =>
          left.left < right.right &&
          left.right > right.left &&
          left.top < right.bottom &&
          left.bottom > right.top;
        const checkedElements = [
          section?.querySelector("h1,h2"),
          section?.querySelector('[class*="copy"]'),
          section?.querySelector('[class*="blocks"]'),
          section?.querySelector('a[href^="#"]'),
        ].filter((element): element is Element => Boolean(element));
        const intersections =
          railVisible && railRect
            ? checkedElements
                .filter((element) =>
                  overlap(railRect, element.getBoundingClientRect()),
                )
                .map((element) => element.tagName)
            : [];

        return {
          hasHorizontalOverflow:
            document.documentElement.scrollWidth > window.innerWidth + 1,
          intersections,
          railVisible,
        };
      }, target.id);

      expect(layout.hasHorizontalOverflow).toBe(false);
      expect(layout.railVisible).toBe(viewport.width >= 1180);
      expect(layout.intersections).toEqual([]);
    }
  }
});

test("unlocked proposal has no critical accessibility violations", async ({
  page,
}) => {
  await unlockSampleProposal(page);
  await disableMotion(page);

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

async function unlockSampleProposal(page: Page) {
  await page.goto("/proposals/sample-proposal/access");
  await page.getByLabel("Proposal password").fill("demo");
  await page.getByRole("button", { name: /view proposal/i }).click();
  await expect(page).toHaveURL(/\/proposals\/sample-proposal$/);
}

async function disableMotion(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
}
