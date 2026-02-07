/** @vitest-environment jsdom */
import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TabbedInterface } from "@/components/tabbed-interface"

describe("TabbedInterface", () => {
  const tabs = [
    { id: "one", label: "Tab One", content: <div>First</div> },
    { id: "two", label: "Tab Two", content: <div>Second</div> },
  ]

  it("renders default tab and switches", () => {
    const onTabChange = vi.fn()

    render(<TabbedInterface tabs={tabs} defaultTabId="one" onTabChange={onTabChange} />)

    expect(screen.getByText("First")).toBeTruthy()

    fireEvent.click(screen.getByText("Tab Two"))

    expect(screen.getByText("Second")).toBeTruthy()
    expect(onTabChange).toHaveBeenCalledWith("two")
  })

  it("hides tab buttons in photo mode", () => {
    render(<TabbedInterface tabs={tabs} isPhotoMode />)

    expect(screen.queryByText("Tab One")).toBeNull()
    expect(screen.getByText("First")).toBeTruthy()
  })
})
