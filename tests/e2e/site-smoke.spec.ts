import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const publicRoutes = [
  "/",
  "/admin/access",
  "/proposals/sample-proposal/access",
];
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
  { id: "direction", heading: "Where things might live." },
  {
    id: "timeline",
    heading: "Kickoff to launch, in about ten weeks.",
  },
  { id: "next-steps", heading: "Four steps to week one." },
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

test("home route renders only a generic private-link prompt", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /use your private project link/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /open proposal/i })).toHaveCount(
    0,
  );
  await expect(page.getByText(/marl & stone/i)).toHaveCount(0);
  await expect(page.getByText(/demo proposal/i)).toHaveCount(0);
});

test("access route hides proposal identity before unlock", async ({ page }) => {
  await page.goto("/proposals/sample-proposal/access");

  await expect(page).toHaveTitle(/Private Proposal Access/);
  await expect(
    page.getByRole("heading", { name: /enter the project password/i }),
  ).toBeVisible();
  await expect(page.getByText(/marl & stone/i)).toHaveCount(0);
  await expect(page.getByText(/website & commerce proposal/i)).toHaveCount(0);
});

test("proposal detail redirects to access when locked", async ({ page }) => {
  await page.goto("/proposals/sample-proposal");

  await expect(page).toHaveURL(/\/proposals\/sample-proposal\/access/);
  await expect(page.getByLabel("Proposal password")).toBeVisible();
  await expect(page.getByText(/marl & stone/i)).toHaveCount(0);
});

test("admin route redirects to access when locked", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/access/);
  await expect(page.getByLabel("Admin passcode")).toBeVisible();
});

test("wrong admin passcode keeps the visitor on the access flow", async ({
  page,
}) => {
  await page.goto("/admin/access");
  await page.getByLabel("Admin passcode").fill("wrong");
  await page.getByRole("button", { name: /enter admin/i }).click();

  await expect(page).toHaveURL(/\/admin\/access/);
  await expect(
    page.getByText(/that passcode did not unlock admin/i),
  ).toBeVisible();
});

test("correct admin passcode opens the project list", async ({ page }) => {
  await unlockAdmin(page);

  await expect(
    page.getByRole("heading", { name: /proposal projects/i }),
  ).toBeVisible();
  await expect(
    page.locator("article").filter({ hasText: "Marl & Stone" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /view json/i })).toBeVisible();
});

test("admin JSON viewer shows canonical proposal content", async ({ page }) => {
  await unlockAdmin(page);
  await page.getByRole("link", { name: /view json/i }).click();
  await expect(page).toHaveURL(/\/admin\/proposals\/sample-proposal$/);

  const viewer = page.getByTestId("proposal-json-textarea");

  await expect(page.getByText(/json viewer/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /marl & stone/i }),
  ).toBeVisible();
  await expect(viewer).toHaveValue(/"slug": "sample-proposal"/);
  await expect(viewer).toHaveAttribute("readonly", "");
  await expect(page.getByRole("button", { name: /^reset$/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /copy json/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /download/i })).toHaveCount(0);
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
    page.getByRole("heading", { name: "Marl & Stone" }),
  ).toBeVisible();
  await expect(page.getByTestId("proposal-folio")).toHaveText("01 / 13");
});

test("next and previous controls move through proposal slides", async ({
  page,
}) => {
  await unlockSampleProposal(page);

  const progress = page.getByTestId("proposal-progress");
  const before = await progress.evaluate((node) =>
    Number.parseFloat(
      getComputedStyle(node.parentElement as HTMLElement).getPropertyValue(
        "--proposal-progress",
      ),
    ),
  );

  await page.getByRole("button", { name: /^next/i }).click();
  await expect(page).toHaveURL(/#why$/);
  await expect(
    page.getByRole("heading", {
      name: "Marl & Stone has outgrown the places it lives.",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("proposal-folio")).toHaveText("02 / 13");

  const after = await progress.evaluate((node) =>
    Number.parseFloat(
      getComputedStyle(node.parentElement as HTMLElement).getPropertyValue(
        "--proposal-progress",
      ),
    ),
  );

  expect(after).toBeGreaterThan(before);

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/#noticed$/);
  await expect(page.getByTestId("proposal-folio")).toHaveText("03 / 13");

  await page.getByRole("button", { name: /^prev/i }).click();
  await expect(page).toHaveURL(/#why$/);
  await expect(page.getByTestId("proposal-folio")).toHaveText("02 / 13");
});

test("slide markers show progress and jump to proposal slides", async ({
  page,
}) => {
  await unlockSampleProposal(page);
  await disableMotion(page);

  const markers = page.getByTestId("proposal-slide-marker");

  await expect(markers).toHaveCount(13);
  await expect(markers.nth(0)).toHaveAttribute("aria-current", "step");

  await markers.nth(8).click();
  await expect(page).toHaveURL(/#investment$/);
  await expect(page.getByTestId("proposal-folio")).toHaveText("09 / 13");
  await expect(markers.nth(8)).toHaveAttribute("aria-current", "step");

  await markers.nth(0).click();
  await expect(page).toHaveURL(/#cover$/);
  await expect(page.getByTestId("proposal-folio")).toHaveText("01 / 13");
});

test("keyboard navigation moves between proposal slides", async ({ page }) => {
  await unlockSampleProposal(page);
  await disableMotion(page);

  const initialUrl = page.url();
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(initialUrl);

  await page.keyboard.press("ArrowDown");
  await expect(page).toHaveURL(/#why$/);

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/#noticed$/);

  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/#why$/);

  await page.keyboard.press(" ");
  await expect(page).toHaveURL(/#noticed$/);

  await page.keyboard.press("Shift+Space");
  await expect(page).toHaveURL(/#why$/);
});

test("proposal interactive content does not trigger deck keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1365, height: 900 });
  await unlockSampleProposal(page);
  await disableMotion(page);
  await goToSlide(page, "appendix");

  const heading = page.getByRole("heading", {
    name: "The fine print, folded away.",
  });
  const summary = page.locator("summary", { hasText: "Assumptions" });
  const details = page.locator("details", { has: summary });

  await summary.click();
  await expect(details).toHaveAttribute("open", "");
  await summary.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/#appendix$/);
  await expect(page.getByTestId("proposal-folio")).toHaveText("13 / 13");
  await expect(heading).toBeVisible();
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
      await goToSlide(page, target.id);
      await disableMotion(page);
      await expect(
        page.locator(`#${target.id}`).getByRole("heading", {
          name: target.heading,
        }),
      ).toBeVisible();

      const layout = await page.evaluate((sectionId) => {
        const section = document.getElementById(sectionId);
        const sectionRect = section?.getBoundingClientRect();
        const footer = document.querySelector("footer");
        const markerCount =
          footer?.querySelectorAll('[data-testid="proposal-slide-marker"]')
            .length ?? 0;

        return {
          hasHorizontalOverflow:
            document.documentElement.scrollWidth > window.innerWidth + 1,
          activeSlideVisible: Boolean(
            sectionRect &&
            sectionRect.left >= -1 &&
            sectionRect.right <= window.innerWidth + 1,
          ),
          hasNavigation: Boolean(
            footer?.querySelector('button[aria-label="Previous slide"]') &&
            footer?.querySelector('button[aria-label="Next slide"]') &&
            markerCount === 13,
          ),
        };
      }, target.id);

      expect(layout.hasHorizontalOverflow).toBe(false);
      expect(layout.activeSlideVisible).toBe(true);
      expect(layout.hasNavigation).toBe(true);
    }
  }
});

test("direct slide hashes and browser history stay in sync", async ({
  page,
}) => {
  await unlockSampleProposal(page);
  await disableMotion(page);

  await page.goto("/proposals/sample-proposal#investment");
  await expect(page.getByTestId("proposal-folio")).toHaveText("09 / 13");
  await expect(
    page.getByRole("heading", { name: "Three ways to work together." }),
  ).toBeVisible();

  await page.getByRole("button", { name: /^next/i }).click();
  await expect(page).toHaveURL(/#addons$/);

  await page.goBack();
  await expect(page).toHaveURL(/#investment$/);
  await expect(page.getByTestId("proposal-folio")).toHaveText("09 / 13");
});

test("deck omits quick navigation controls in v1", async ({ page }) => {
  await unlockSampleProposal(page);

  await expect(page.getByRole("button", { name: /contents/i })).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: /proposal sections/i }),
  ).toHaveCount(0);
});

test("unlocked proposal has no critical accessibility violations", async ({
  page,
}) => {
  await unlockSampleProposal(page);
  await disableMotion(page);

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("unlocked admin dashboard has no critical accessibility violations", async ({
  page,
}) => {
  await unlockAdmin(page);

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

async function unlockAdmin(page: Page) {
  await page.goto("/admin/access");
  await page.getByLabel("Admin passcode").fill("admin-demo");
  await page.getByRole("button", { name: /enter admin/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function unlockSampleProposal(page: Page) {
  await page.goto("/proposals/sample-proposal/access");
  await page.getByLabel("Proposal password").fill("demo");
  await page.getByRole("button", { name: /view proposal/i }).click();
  await expect(page).toHaveURL(/\/proposals\/sample-proposal$/);
  await expect(page.getByTestId("proposal-deck")).toHaveAttribute(
    "data-ready",
    "true",
  );
}

async function goToSlide(page: Page, slideId: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate((id) => {
    window.history.pushState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, slideId);
  await expect(page).toHaveURL(new RegExp(`#${slideId}$`));
  await expect(page.locator(`#${slideId}`)).toHaveAttribute(
    "data-active",
    "true",
  );
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
