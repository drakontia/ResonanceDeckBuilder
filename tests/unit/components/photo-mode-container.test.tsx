/** @vitest-environment jsdom */
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PhotoModeContainer } from "@/components/photo-mode-container"

const photoModeMocks = vi.hoisted(() => ({
  lastRef: null as React.RefObject<HTMLDivElement> | null,
}))

vi.mock("@/components/screenshot-button", () => ({
  ScreenshotButton: ({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) => {
    photoModeMocks.lastRef = targetRef
    return <div data-testid="screenshot-button" />
  },
}))

describe("PhotoModeContainer", () => {
  it("adds photo mode class and passes ref", () => {
    render(
      <PhotoModeContainer isPhotoMode>
        <div>Content</div>
      </PhotoModeContainer>,
    )

    const container = screen.getByText("Content").parentElement
    expect(container?.classList.contains("photo-mode")).toBe(true)
    expect(screen.getByTestId("screenshot-button")).toBeTruthy()
    expect(photoModeMocks.lastRef?.current).toBeInstanceOf(HTMLDivElement)
  })

  it("does not add photo mode class when disabled", () => {
    render(
      <PhotoModeContainer isPhotoMode={false}>
        <div>Content</div>
      </PhotoModeContainer>,
    )

    const container = screen.getByText("Content").parentElement
    expect(container?.classList.contains("photo-mode")).toBe(false)
  })
})
