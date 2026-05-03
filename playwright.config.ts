import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/jp",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: "e2e-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "e2e.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "e2e-project",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "e2e.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "1234567890",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:1234567890:web:e2e",
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-E2E0000000",
      NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED: "false",
    },
  },
})
