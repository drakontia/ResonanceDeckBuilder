/** @vitest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useDataLoader } from "../../../hooks/use-data-loader"

vi.mock("@/lib/breakDb", () => ({ breakthroughs: {} }))
vi.mock("@/lib/cardDb", () => ({ cards: {} }))
vi.mock("@/lib/charDb", () => ({
  characters: {
    "1": {
      id: 1,
      name: "Hero",
      quality: "threeStar",
      skillList: [],
      tk_SN: 0,
      identity: "hero_identity",
    },
  },
}))
vi.mock("@/lib/charSkillMap", () => ({ charSkillMap: {} }))
vi.mock("@/lib/equipDb", () => ({
  equipments: {
    "10": {
      id: 10,
      name: "Weapon",
      des: "",
      equipTagId: 12600155,
      quality: "R",
      skillList: {
        a: { skillId: 5 },
      },
    },
  },
}))
vi.mock("@/lib/homeSkillDb", () => ({ homeSkills: {} }))
vi.mock("@/lib/imgDb", () => ({
  images: {
    char_1: "char-url",
    equip_10: "equip-url",
  },
}))
vi.mock("@/lib/itemSkillMap", () => ({ itemSkillMap: {} }))
vi.mock("@/lib/skillDb", () => ({ skills: {} }))
vi.mock("@/lib/talentDb", () => ({ talents: {} }))
vi.mock("../dummy", () => ({ dummyData: {} }))

describe("useDataLoader", () => {
  it("loads data and enriches fields", async () => {
    const { result } = renderHook(() => useDataLoader())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const data = result.current.data
    expect(data).toBeDefined()

    const character = data?.characters["1"]
    expect(character?.img_card).toBe("char-url")
    expect(character?.rarity).toBe("R")
    expect(character?.desc).toBe("hero_identity")

    const equipment = data?.equipments?.["10"]
    expect(equipment?.type).toBe("weapon")
    expect(equipment?.url).toBe("equip-url")
    expect(Array.isArray(equipment?.skillList)).toBe(true)
    expect(equipment?.skillList?.[0].skillId).toBe(5)
  })
})
