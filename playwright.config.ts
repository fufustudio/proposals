import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:3020",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start -- -p 3020",
    env: {
      PROPOSAL_ACCESS_CODES: '{"sample-proposal":"demo"}',
      PROPOSAL_SESSION_SECRET: "playwright-proposal-session-secret",
      ADMIN_ACCESS_CODE: "admin-demo",
      ADMIN_SESSION_SECRET: "playwright-admin-session-secret",
    },
    url: "http://127.0.0.1:3020",
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
