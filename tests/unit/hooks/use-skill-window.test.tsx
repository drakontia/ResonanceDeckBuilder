/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useSkillWindow } from "../../../hooks/deck-builder/useSkillWindow"

vi.mock("@/lib/tagDb", () => ({
  tagDb: {
    "1": { tagName: "tag.one", detail: "detail.one" },
    "2": { tagName: "tag.two", detail: "detail.two" },
  },
}))

vi.mock("@/lib/tagColorMapping", () => ({
  tagColorMapping: {
    "#FF0000": [1],
    "#00FF00": [2],
  },
}))

describe("useSkillWindow", () => {
  it("splits normal/derived cards and computes status effects", () => {
    const onUpdateCardSettings = vi.fn()

    const { result } = renderHook(() =>
      useSkillWindow({
        selectedCards: [
          { id: "1", useType: 1, useParam: -1, skillId: 10 },
          { id: "2", useType: 1, useParam: -1, skillId: 99 },
        ],
        availableCards: [
          {
            card: { id: 1, tagList: [{ tagId: 1 }] },
            extraInfo: { name: "A", desc: "", cost: 0, amount: 1 },
          },
          {
            card: { id: 2, tagList: [{ tagId: 2 }] },
            extraInfo: { name: "B", desc: "", cost: 0, amount: 1 },
          },
        ],
        onUpdateCardSettings,
        data: { charSkillMap: { "1": { skills: [10] } } },
      }),
    )

    expect(result.current.normalCards).toHaveLength(1)
    expect(result.current.derivedCards).toHaveLength(1)
    expect(result.current.statusEffects).toHaveLength(2)

    const sources = result.current.statusEffects.map((effect) => effect.source)
    expect(sources.sort()).toEqual(["derived", "normal"].sort())
  })

  it("handles drag start and end", () => {
    const onUpdateCardSettings = vi.fn()
    const container = document.createElement("div")

    const { result } = renderHook(() =>
      useSkillWindow({
        selectedCards: [
          { id: "a", useType: 1, useParam: -1 },
          { id: "b", useType: 1, useParam: -1 },
        ],
        availableCards: [
          { card: { id: "a" }, extraInfo: { name: "A", desc: "", cost: 0, amount: 1 } },
          { card: { id: "b" }, extraInfo: { name: "B", desc: "", cost: 0, amount: 1 } },
        ],
        onUpdateCardSettings,
        data: { charSkillMap: {} },
      }),
    )

    act(() => {
      result.current.skillContainerRef.current = container
      result.current.handleDragStart({ active: { id: "a" } })
    })

    expect(document.body.classList.contains("dragging")).toBe(true)
    expect(container.classList.contains("dragging-container")).toBe(true)

    let resultIndices: any
    act(() => {
      resultIndices = result.current.handleDragEnd({ active: { id: "a" }, over: { id: "b" } })
    })

    expect(resultIndices).toEqual({ oldIndex: 0, newIndex: 1 })
    expect(document.body.classList.contains("dragging")).toBe(false)
    expect(container.classList.contains("dragging-container")).toBe(false)
    expect(result.current.activeId).toBeNull()
  })
})
