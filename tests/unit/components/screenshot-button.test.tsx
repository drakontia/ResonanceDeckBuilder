/** @vitest-environment jsdom */
import React from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ScreenshotButton } from "@/components/screenshot-button"

const screenshotMocks = vi.hoisted(() => ({
  logEventWrapper: vi.fn(),
  toPngMock: vi.fn().mockResolvedValue("data-url"),
}))

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock("@/lib/firebase-config", () => ({
  analytics: {},
  logEventWrapper: screenshotMocks.logEventWrapper,
}))

vi.mock("html-to-image", () => ({
  toPng: screenshotMocks.toPngMock,
}))

describe("ScreenshotButton", () => {
  it("captures screenshot and toggles capture mode", async () => {
    vi.useFakeTimers()

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    const target = document.createElement("div")
    const targetRef = { current: target }

    render(<ScreenshotButton targetRef={targetRef} />)

    fireEvent.click(screen.getByRole("button"))

    expect(target.classList.contains("capture-mode")).toBe(true)

    await act(async () => {
      await vi.runAllTimersAsync()
      await Promise.resolve()
    })

    expect(screenshotMocks.toPngMock).toHaveBeenCalled()
    expect(target.classList.contains("capture-mode")).toBe(false)

    expect(screenshotMocks.logEventWrapper).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
    vi.useRealTimers()
  })
})
