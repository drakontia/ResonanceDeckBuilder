/** @vitest-environment jsdom */
import React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useIsMobile } from "../../../hooks/use-mobile"

describe("useIsMobile", () => {
  it("tracks window width changes", () => {
    let listener: ((event: MediaQueryListEvent) => void) | null = null

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: (_: string, cb: (event: MediaQueryListEvent) => void) => {
          listener = cb
        },
        removeEventListener: () => {},
      }),
    })

    Object.defineProperty(window, "innerWidth", { writable: true, value: 500 })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)

    act(() => {
      window.innerWidth = 900
      listener?.(new Event("change") as MediaQueryListEvent)
    })

    expect(result.current).toBe(false)
  })
})
