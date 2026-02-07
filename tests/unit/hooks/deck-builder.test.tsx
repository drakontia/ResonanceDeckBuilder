/** @vitest-environment jsdom */
import React from "react"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { Database } from "../../../types"
import { useCards } from "../../../hooks/deck-builder/use-cards"
import { useCharacters } from "../../../hooks/deck-builder/use-characters"
import { useEquipment } from "../../../hooks/deck-builder/use-equipment"

const mockData: Database = {
  characters: {
    "1": {
      id: 1,
      name: "Hero",
      quality: "SR",
      skillList: [{ num: 2, skillId: 10 }],
      tk_SN: 0,
    },
  },
  cards: {
    "100": {
      id: 100,
      name: "Strike",
      cost_SN: 20000,
      color: "Red",
      cardType: "Normal",
      tagList: [],
    },
  },
  skills: {
    "10": {
      id: 10,
      name: "Strike Skill",
      mod: "",
      description: "desc",
      detailDescription: "detail",
      ExSkillList: [],
      cardID: 100,
    },
  },
  breakthroughs: {},
  talents: {},
  images: {
    card_100: "card.png",
  },
  charSkillMap: {},
  itemSkillMap: {},
}

describe("deck-builder hooks", () => {
  it("useCharacters manages leader and selection", () => {
    const { result } = renderHook(() => useCharacters(mockData))

    act(() => {
      result.current.setSelectedCharacters([1, -1, -1, -1, -1])
    })

    expect(result.current.selectedCharacters[0]).toBe(1)
    expect(result.current.leaderCharacter).toBe(1)

    act(() => {
      result.current.setLeader(1)
    })

    expect(result.current.leaderCharacter).toBe(1)

    act(() => {
      result.current.setLeader(999, true)
    })

    expect(result.current.leaderCharacter).toBe(1)
  })

  it("useEquipment exposes equipment and lookups", () => {
    const dataWithEquipments: Database = {
      ...mockData,
      equipments: {
        weaponA: { id: 1, name: "Weapon", des: "", equipTagId: 1, quality: "R" },
      },
    }

    const { result } = renderHook(() => useEquipment(dataWithEquipments))

    expect(result.current.equipment).toHaveLength(5)
    expect(result.current.getEquipment("weaponA")?.name).toBe("Weapon")
    expect(result.current.allEquipments).toHaveLength(1)
  })

  it("useCards adds and updates cards", () => {
    const { result } = renderHook(() => useCards(mockData))

    act(() => {
      result.current.addCard("100", "character", 1, { skillId: 10, slotIndex: 0 })
    })

    expect(result.current.selectedCards).toHaveLength(1)
    expect(result.current.selectedCards[0].id).toBe("100")
    expect(result.current.selectedCards[0].extraInfo?.cost).toBe(2)
    expect(result.current.selectedCards[0].extraInfo?.amount).toBe(2)
    expect(result.current.selectedCards[0].extraInfo?.img_url).toBe("card.png")

    act(() => {
      result.current.updateCardSettings("100", 2, 99)
    })

    expect(result.current.selectedCards[0].useType).toBe(2)
    expect(result.current.selectedCards[0].useParam).toBe(99)

    act(() => {
      result.current.addCard("100", "equipment", "weaponA", { skillId: 10, slotIndex: 0, equipType: "weapon" })
    })

    expect(result.current.selectedCards[0].sources).toHaveLength(2)

    act(() => {
      result.current.removeCard("100")
    })

    expect(result.current.selectedCards).toHaveLength(0)
  })

  it("useCards reorders cards", () => {
    const { result } = renderHook(() => useCards(mockData))

    act(() => {
      result.current.addCard("100", "character", 1, { skillId: 10, slotIndex: 0 })
      result.current.addCard("100", "equipment", "weaponA", { skillId: 10, slotIndex: 1, equipType: "weapon" })
    })

    expect(result.current.selectedCards).toHaveLength(1)

    act(() => {
      result.current.addCard("100", "character", 1, { skillId: 10, slotIndex: 2 })
    })

    expect(result.current.selectedCards[0].sources).toHaveLength(3)

    act(() => {
      result.current.reorderCards(0, 0)
    })

    expect(result.current.selectedCards).toHaveLength(1)
  })
})
