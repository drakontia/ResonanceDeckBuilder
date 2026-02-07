import { describe, expect, it } from "vitest"

import { getCardById, getCharacterById, getEquipmentById, getSkillById, isValidCardId } from "../../../hooks/deck-builder/utils"
import type { Database } from "../../../types"

const mockDb: Database = {
  characters: {
    "1": { id: 1, name: "Alice", quality: "SR", skillList: [], tk_SN: 0 },
  },
  cards: {
    "10": { id: 10, name: "Slash" },
  },
  skills: {
    "100": {
      id: 100,
      name: "Skill A",
      mod: "",
      description: "",
      detailDescription: "",
      ExSkillList: [],
      cardID: 10,
    },
  },
  breakthroughs: {},
  talents: {},
  images: {},
  charSkillMap: {},
  itemSkillMap: {},
}

describe("deck-builder utils basic getters", () => {
  it("gets character by id and returns null for missing", () => {
    expect(getCharacterById(mockDb, 1)?.name).toBe("Alice")
    expect(getCharacterById(mockDb, -1)).toBeNull()
    expect(getCharacterById(null, 1)).toBeNull()
  })

  it("gets card by id and validates id existence", () => {
    expect(getCardById(mockDb, "10")?.name).toBe("Slash")
    expect(getCardById(mockDb, "999")).toBeNull()
    expect(isValidCardId(mockDb, "10")).toBe(true)
    expect(isValidCardId(mockDb, "999")).toBe(false)
  })

  it("gets skill by id and returns null when db or id is missing", () => {
    expect(getSkillById(mockDb, 100)?.cardID).toBe(10)
    expect(getSkillById(mockDb, 999)).toBeNull()
    expect(getSkillById(null, 100)).toBeNull()
  })

  it("gets equipment by id and returns null when missing", () => {
    const dbWithEquipment: Database = {
      ...mockDb,
      equipments: {
        weaponA: { id: 1, name: "Weapon A", des: "", equipTagId: 1, quality: "R" },
      },
    }

    expect(getEquipmentById(dbWithEquipment, "weaponA")?.name).toBe("Weapon A")
    expect(getEquipmentById(dbWithEquipment, "missing")).toBeNull()
    expect(getEquipmentById(mockDb, "weaponA")).toBeNull()
    expect(getEquipmentById(null, "weaponA")).toBeNull()
  })
})
