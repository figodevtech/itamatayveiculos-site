import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const suppliedExecutable = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
const localExecutable = "C:/Users/luc14/AppData/Local/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-win64/chrome-headless-shell.exe";
const executablePath = suppliedExecutable ?? (existsSync(localExecutable) ? localExecutable : undefined);

export default defineConfig({
  testDir: "./browser",
  timeout: 35_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: "../test-results",
  reporter: [["list"], ["json", { outputFile: fileURLToPath(new URL("../.work/performance-e2e-results.json", import.meta.url)) }]],
  use: {
    baseURL: process.env.SITE_TEST_URL ?? "http://127.0.0.1:3100",
    launchOptions: { executablePath },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" } },
  ],
});
