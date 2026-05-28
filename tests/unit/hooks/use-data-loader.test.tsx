/** @vitest-environment jsdom */
import { renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDataLoader } from "../../../hooks/use-data-loader"

const mockDatabase = {
  characters: {
    "1": {
      id: 1,
      name: "Hero",
      quality: "threeStar",
      skillList: [],
      tk_SN: 0,
      identity: "hero_identity",
      img_card: "char-url",
      rarity: "R",
      desc: "hero_identity",
    },
  },
  cards: {},
  skills: {},
  breakthroughs: {},
  talents: {},
  images: { char_1: "char-url", equip_10: "equip-url" },
  equipments: {
    "10": {
      id: 10,
      name: "Weapon",
      des: "",
      equipTagId: 12600155,
      quality: "R",
      type: "weapon",
      url: "equip-url",
      skillList: [{ skillId: 5 }],
    },
  },
  equipmentTypes: {},
  homeSkills: {},
  charSkillMap: {},
  itemSkillMap: {},
}

describe("useDataLoader", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDatabase),
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it("/api/master-data を fetch してデータを返す", async () => {
    const { result } = renderHook(() => useDataLoader())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(vi.mocked(fetch)).toHaveBeenCalledWith("/api/master-data")

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

  it("fetch が失敗した場合 error を返す", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    const { result } = renderHook(() => useDataLoader())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.data).toBeNull()
  })

  it("ネットワークエラーの場合 error を返す", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")))

    const { result } = renderHook(() => useDataLoader())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe("Network error")
  })
})
