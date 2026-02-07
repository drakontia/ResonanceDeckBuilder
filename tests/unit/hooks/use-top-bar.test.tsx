/** @vitest-environment jsdom */
import React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useTopBar } from "../../../hooks/deck-builder/useTopBar"

describe("useTopBar", () => {
  it("toggles language menu and help popup", () => {
    const onLanguageChange = vi.fn()
    const { result } = renderHook(() => useTopBar({ onLanguageChange }))

    expect(result.current.showLanguageMenu).toBe(false)

    act(() => {
      result.current.toggleLanguageMenu()
    })

    expect(result.current.showLanguageMenu).toBe(true)

    act(() => {
      result.current.toggleHelpPopup()
    })

    expect(result.current.showHelpPopup).toBe(true)

    act(() => {
      result.current.handleLanguageSelect("jp")
    })

    expect(onLanguageChange).toHaveBeenCalledWith("jp")
    expect(result.current.showLanguageMenu).toBe(false)
  })

  it("updates scrolled state on scroll", () => {
    Object.defineProperty(window, "scrollY", { value: 30, writable: true })

    const { result } = renderHook(() => useTopBar({ onLanguageChange: vi.fn() }))

    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current.scrolled).toBe(true)
  })

  it("closes language menu on outside click", () => {
    const { result } = renderHook(() => useTopBar({ onLanguageChange: vi.fn() }))

    const menu = document.createElement("div")

    act(() => {
      result.current.languageMenuRef.current = menu
      result.current.toggleLanguageMenu()
    })

    expect(result.current.showLanguageMenu).toBe(true)

    act(() => {
      document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    })

    expect(result.current.showLanguageMenu).toBe(false)
  })
})
