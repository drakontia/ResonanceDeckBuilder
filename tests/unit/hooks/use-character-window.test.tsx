/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useCharacterWindow } from "../../../hooks/deck-builder/useCharacterWindow"

describe("useCharacterWindow", () => {
  const t = (key: string) => key

  it("filters, sorts, and selects characters", () => {
    const onAddCharacter = vi.fn()
    const onRemoveCharacter = vi.fn()

    const { result } = renderHook(() =>
      useCharacterWindow({
        selectedCharacters: [1, -1, -1, -1, -1],
        availableCharacters: [
          { id: 1, name: "Alice", rarity: "SSR" },
          { id: 2, name: "Bob", rarity: "UR" },
          { id: 3, name: "Clara", rarity: "R" },
        ] as any,
        onAddCharacter,
        onRemoveCharacter,
        t,
      }),
    )

    expect(result.current.sortedCharacters.map((c) => c.id)).toEqual([2, 3])

    act(() => {
      result.current.handleOpenSelector(0)
    })

    act(() => {
      result.current.handleCharacterSelect(2)
    })

    expect(onRemoveCharacter).toHaveBeenCalledWith(0)
    expect(onAddCharacter).toHaveBeenCalledWith(2, 0)

    act(() => {
      result.current.handleSearchChange("cl")
    })

    expect(result.current.sortedCharacters.map((c) => c.id)).toEqual([3])

    act(() => {
      result.current.handleSortByChange("name")
    })

    expect(result.current.sortedCharacters.map((c) => c.id)).toEqual([3])
  })
})
