import { describe, expect, it } from "vitest"

import { getAvailableCardIds, hasSource, isSameSource } from "../../../hooks/deck-builder/utils"
import type { Database } from "../../../types"
import type { EquipmentSlot, SelectedCard } from "../../../hooks/deck-builder/types"

describe("deck-builder utils", () => {
  const baseData: Database = {
    characters: {
      "100": {
        id: 100,
        name: "Test Hero",
        quality: "SR",
        skillList: [],
        tk_SN: 0,
      },
    },
    cards: {
      "10": { id: 10, name: "Hero Skill Card" },
      "40": { id: 40, name: "Weapon Skill Card" },
    },
    skills: {
      "1": {
        id: 1,
        name: "Hero Skill",
        mod: "",
        description: "",
        detailDescription: "",
        ExSkillList: [],
        cardID: 10,
      },
      "4": {
        id: 4,
        name: "Weapon Skill",
        mod: "",
        description: "",
        detailDescription: "",
        ExSkillList: [],
        cardID: 40,
      },
    },
    breakthroughs: {},
    talents: {},
    images: {},
    charSkillMap: {
      "100": {
        skills: [1],
        relatedSkills: [],
        notFromCharacters: [],
      },
    },
    itemSkillMap: {
      weaponA: {
        relatedSkills: [4],
      },
    },
  }

  const emptyEquipment: EquipmentSlot[] = Array.from({ length: 5 }, () => ({
    weapon: null,
    armor: null,
    accessory: null,
  }))

  it("collects card ids and sources from characters and equipment", () => {
    const equipment = [...emptyEquipment]
    equipment[0] = { weapon: "weaponA", armor: null, accessory: null }

    const { idSet, cardSources } = getAvailableCardIds(baseData, [100, -1, -1, -1, -1], equipment)

    expect(idSet.has("10")).toBe(true)
    expect(idSet.has("40")).toBe(true)

    const charSource = cardSources.find((c) => c.cardId === "10")?.source
    expect(charSource).toBeDefined()
    expect(charSource).toMatchObject({ type: "character", id: 100, skillId: 1, slotIndex: 0 })

    const equipSource = cardSources.find((c) => c.cardId === "40")?.source
    expect(equipSource).toBeDefined()
    expect(equipSource).toMatchObject({ type: "equipment", id: "weaponA", skillId: 4, slotIndex: 0, equipType: "weapon" })
  })

  it("compares sources including equipment type", () => {
    const left = { type: "equipment", id: "weaponA", skillId: 4, slotIndex: 0, equipType: "weapon" } as const
    const rightMismatch = { type: "equipment", id: "weaponA", skillId: 4, slotIndex: 0, equipType: "armor" } as const
    const rightMatch = { type: "equipment", id: "weaponA", skillId: 4, slotIndex: 0, equipType: "weapon" } as const

    expect(isSameSource(left, rightMismatch)).toBe(false)
    expect(isSameSource(left, rightMatch)).toBe(true)
  })

  it("checks if a card already has a source", () => {
    const card: SelectedCard = {
      id: "10",
      useType: 1,
      useParam: -1,
      sources: [{ type: "character", id: 100, skillId: 1, slotIndex: 0 }],
    }

    const sameSource = { type: "character", id: 100, skillId: 1, slotIndex: 0 } as const
    const differentSource = { type: "character", id: 101, skillId: 2, slotIndex: 1 } as const

    expect(hasSource(card, sameSource)).toBe(true)
    expect(hasSource(card, differentSource)).toBe(false)
  })

  it("returns empty results when data is null", () => {
    const { idSet, cardSources } = getAvailableCardIds(null, [100], emptyEquipment)

    expect(idSet.size).toBe(0)
    expect(cardSources).toHaveLength(0)
  })

  it("handles missing maps and multiple equipment types", () => {
    const extendedData: Database = {
      ...baseData,
      itemSkillMap: {
        ...baseData.itemSkillMap,
        armorA: { relatedSkills: [4] },
        accessoryA: { relatedSkills: [] },
      },
    }

    const equipment = [...emptyEquipment]
    equipment[0] = { weapon: "weaponA", armor: "armorA", accessory: "accessoryA" }

    const { idSet, cardSources } = getAvailableCardIds(extendedData, [999, 100, -1, -1, -1], equipment)

    expect(idSet.has("10")).toBe(true)
    expect(idSet.has("40")).toBe(true)

    const armorSource = cardSources.find((c) => c.source.type === "equipment" && c.source.equipType === "armor")
    expect(armorSource?.source).toMatchObject({ id: "armorA", equipType: "armor" })
  })
})
