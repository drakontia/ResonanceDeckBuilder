/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useCharacterSlot } from "@/hooks/deck-builder/useCharacterSlot"

describe("useCharacterSlot", () => {
  it("computes sizes and handles interactions", () => {
    let width = 120
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return width
      },
    })

    const { result } = renderHook(() => useCharacterSlot({ isEmpty: false, character: { rarity: "UR" } }))

    const container = document.createElement("div")
    result.current.characterSlotRef.current = container

    act(() => {
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current.buttonSize).toBe(30)
    expect(result.current.crownSize).toBeCloseTo(39.6, 2)
    expect(result.current.characterSlotStyle.borderColor).toBe("#f97316")

    act(() => {
      result.current.handleEquipmentClick("weapon")
    })

    expect(result.current.showEquipmentSelector).toBe("weapon")

    act(() => {
      result.current.handleOpenCharacterDetails()
    })

    expect(result.current.showCharacterDetails).toBe(true)

    act(() => {
      width = 80
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current.buttonSize).toBe(20)
  })

  it("blocks interactions when empty", () => {
    const { result } = renderHook(() => useCharacterSlot({ isEmpty: true, character: null }))

    act(() => {
      result.current.handleEquipmentClick("armor")
    })

    expect(result.current.showEquipmentSelector).toBeNull()

    act(() => {
      result.current.handleOpenCharacterDetails()
    })

    expect(result.current.showCharacterDetails).toBe(false)
  })
})
