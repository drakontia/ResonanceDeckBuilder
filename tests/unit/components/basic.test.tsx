/** @vitest-environment jsdom */
import React from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { LoadingScreen } from "@/components/loading-screen"
import { StylizedTitle } from "@/components/stylized-title"
import { Toast, useToast } from "@/components/toast-notification"

describe("basic components", () => {
  it("renders stylized title", () => {
    render(<StylizedTitle mainText="Main" subText="Sub" />)

    expect(screen.getByText("Main")).toBeTruthy()
    expect(screen.getByText("Sub")).toBeTruthy()
  })

  it("renders loading screen with default and custom message", () => {
    const { rerender } = render(<LoadingScreen />)

    expect(screen.getByText("Loading...")).toBeTruthy()

    rerender(<LoadingScreen message="Please wait" />)
    expect(screen.getByText("Please wait")).toBeTruthy()
  })

  it("renders toast and triggers close", () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    render(<Toast message="Saved" type="success" duration={500} onClose={onClose} />)

    expect(screen.getByText("Saved")).toBeTruthy()
    const toastRoot = screen.getByText("Saved").parentElement?.parentElement
    expect(toastRoot?.classList.contains("border-green-500")).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onClose).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it("shows and hides toasts with hook", () => {
    const TestHarness = () => {
      const { showToast, ToastContainer } = useToast()

      return (
        <div>
          <button onClick={() => showToast("Hello", "success")}>Show</button>
          <ToastContainer />
        </div>
      )
    }

    render(<TestHarness />)

    fireEvent.click(screen.getByText("Show"))
    expect(screen.getByText("Hello")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "✕" }))
    expect(screen.queryByText("Hello")).toBeNull()
  })
})
