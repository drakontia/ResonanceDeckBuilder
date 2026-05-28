/** @vitest-environment jsdom */
import React from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ScreenshotButton } from "@/components/screenshot-button"

const screenshotMocks = vi.hoisted(() => ({
  logEventWrapper: vi.fn(),
  toPngMock: vi.fn().mockResolvedValue("data-url"),
}))

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock("@/lib/firebase-analytics", () => ({
  analytics: {},
  logEventWrapper: screenshotMocks.logEventWrapper,
}))

vi.mock("html-to-image", () => ({
  toPng: screenshotMocks.toPngMock,
}))

describe("ScreenshotButton", () => {
  beforeEach(() => {
    screenshotMocks.logEventWrapper.mockClear()
    screenshotMocks.toPngMock.mockReset()
    screenshotMocks.toPngMock.mockResolvedValue("data-url")
  })

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

    expect(screenshotMocks.toPngMock).toHaveBeenCalledWith(
      target,
      expect.objectContaining({
        cacheBust: true,
        imagePlaceholder: expect.stringContaining("data:image/gif;base64"),
        fetchRequestInit: { mode: "cors", credentials: "omit" },
      }),
    )
    expect(target.classList.contains("capture-mode")).toBe(false)

    expect(screenshotMocks.logEventWrapper).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()

    clickSpy.mockRestore()
    vi.useRealTimers()
  })

  it("calls onCaptureError when capture fails", async () => {
    vi.useFakeTimers()
    const onCaptureError = vi.fn()
    const target = document.createElement("div")
    const targetRef = { current: target }
    screenshotMocks.toPngMock.mockRejectedValueOnce(new Error("capture failure"))

    render(<ScreenshotButton targetRef={targetRef} onCaptureError={onCaptureError} />)
    fireEvent.click(screen.getByRole("button"))

    await act(async () => {
      await vi.runAllTimersAsync()
      await Promise.resolve()
    })

    expect(onCaptureError).toHaveBeenCalledWith(expect.any(Error))
    expect(target.classList.contains("capture-mode")).toBe(false)
    vi.useRealTimers()
  })

  it("calls onCaptureError when target is missing", () => {
    const onCaptureError = vi.fn()
    const targetRef = { current: null }

    render(<ScreenshotButton targetRef={targetRef} onCaptureError={onCaptureError} />)
    fireEvent.click(screen.getByRole("button"))

    expect(onCaptureError).toHaveBeenCalledWith(expect.any(Error))
    expect(screenshotMocks.toPngMock).not.toHaveBeenCalled()
  })
})
