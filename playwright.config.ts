import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3020";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run start -- --port ${port}`,
    env: {
      PROPOSAL_ACCESS_CODES: '{"sample-proposal":"demo"}',
      PROPOSAL_SESSION_SECRET: "playwright-proposal-session-secret",
      ADMIN_ACCESS_CODE: "admin-demo",
      ADMIN_SESSION_SECRET: "playwright-admin-session-secret",
    },
    url: baseURL,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
