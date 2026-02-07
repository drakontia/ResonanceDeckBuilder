/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useCardSettings } from "../../../hooks/deck-builder/useCardSettings"

describe("useCardSettings", () => {
  it("updates option and param map with bounds", () => {
    const onSave = vi.fn()

    const { result } = renderHook(() =>
      useCardSettings({
        cardId: "1",
        initialUseType: 1,
        initialUseParam: -1,
        initialUseParamMap: { "3": 2 },
        onSave,
      }),
    )

    act(() => {
      result.current.handleOptionSelect(5, 9)
    })

    expect(result.current.useType).toBe(5)
    expect(result.current.useParam).toBe(9)
    expect(onSave).toHaveBeenCalledWith("1", 5, 9, { "3": 2 })

    act(() => {
      result.current.handleParamChange(3, 99, 1, 10)
    })

    expect(result.current.useType).toBe(3)
    expect(result.current.useParam).toBe(10)
    expect(result.current.useParamMap["3"]).toBe(10)
    expect(onSave).toHaveBeenCalledWith("1", 3, 10, { "3": 10 })
  })
})
