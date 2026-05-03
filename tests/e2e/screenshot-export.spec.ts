import { expect, test } from "@playwright/test"

const TINY_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6M5x8AAAAASUVORK5CYII="

test("exports deck screenshot as a downloadable PNG", async ({ page }) => {
  await page.route("https://patchwiki.biligame.com/images/resonance/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      headers: {
        "access-control-allow-origin": "*",
        "cache-control": "no-store",
      },
      body: Buffer.from(TINY_PNG_BASE64, "base64"),
    })
  })

  await page.goto("/jp")
  await expect(page.locator(".capture-content")).toBeVisible()

  const downloadPromise = page.waitForEvent("download")
  await page.locator("button.screenshot-button").click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toMatch(/^deck-builder-screenshot-.*\.png$/)
})
