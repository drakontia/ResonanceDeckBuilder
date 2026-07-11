/** @vitest-environment jsdom */
import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useDeckBuilder } from "@/hooks/deck-builder"
import type { Database } from "@/types"

const t = Object.assign(
  (key: string) => key,
  {
    rich: (key: string) => key,
  },
)

vi.mock("next-intl", () => ({
  useTranslations: () => t,
}))

vi.mock("@/hooks/deck-builder/use-battle", () => ({
  useBattle: () => ({
    battleSettings: {
      isLeaderCardOn: true,
      isSpCardOn: true,
      keepCardNum: 0,
      discardType: 0,
      otherCard: 0,
    },
    updateBattleSettings: vi.fn(),
  }),
}))

vi.mock("@/hooks/deck-builder/use-awakening", () => ({
  useAwakening: () => ({
    awakening: {},
    setAwakening: vi.fn(),
    setCharacterAwakening: vi.fn(),
    removeCharacterAwakening: vi.fn(),
    clearAllAwakening: vi.fn(),
  }),
}))

vi.mock("@/hooks/deck-builder/use-presets", () => ({
  usePresets: () => ({
    exportPreset: vi.fn(),
    exportPresetToString: vi.fn(),
    importPreset: vi.fn(),
    decodePresetString: vi.fn(),
    createShareableUrl: vi.fn(),
    createRootShareableUrl: vi.fn(),
    createPresetObject: vi.fn(),
  }),
}))

const mockData: Database = {
  characters: {
    "10001393": {
      id: 10001393,
      name: "char.10001393.name",
      quality: "FiveStar",
      tk_SN: 0,
      skillList: [
        { num: 2, skillId: 12304489 },
        { num: 2, skillId: 12304490 },
        { num: 1, skillId: 12304861 },
      ],
    },
  },
  cards: {
    "10600474": { id: 10600474, name: "card.10600474.name", ExCondList: [], ExActList: [] },
    "10600571": { id: 10600571, name: "card.10600571.name", ExCondList: [], ExActList: [] },
    "10600572": { id: 10600572, name: "card.10600572.name", ExCondList: [], ExActList: [] },
    "10600573": { id: 10600573, name: "card.10600573.name", ExCondList: [], ExActList: [] },
    "10600574": { id: 10600574, name: "card.10600574.name", ExCondList: [], ExActList: [] },
  },
  skills: {
    "12303725": {
      id: 12303725,
      name: "skill.12303725.name",
      mod: "",
      description: "skill.12303725.description",
      detailDescription: "skill.12303725.detailDescription",
      ExSkillList: [],
      cardID: 10600474,
    },
    "12304489": {
      id: 12304489,
      name: "skill.12304489.name",
      mod: "",
      description: "skill.12304489.description",
      detailDescription: "skill.12304489.detailDescription",
      ExSkillList: [],
      cardID: 10600573,
    },
    "12304490": {
      id: 12304490,
      name: "skill.12304490.name",
      mod: "",
      description: "skill.12304490.description",
      detailDescription: "skill.12304490.detailDescription",
      ExSkillList: [],
      cardID: 10600571,
    },
    "12304492": {
      id: 12304492,
      name: "skill.12304492.name",
      mod: "",
      description: "skill.12304492.description",
      detailDescription: "skill.12304492.detailDescription",
      ExSkillList: [],
      cardID: 10600572,
    },
    "12304861": {
      id: 12304861,
      name: "skill.12304861.name",
      mod: "",
      description: "skill.12304861.description",
      detailDescription: "skill.12304861.detailDescription",
      ExSkillList: [],
      cardID: 10600574,
    },
  },
  breakthroughs: {},
  talents: {},
  images: {},
  charSkillMap: {
    "10001393": {
      skills: [12304489, 12304490, 12304861],
      relatedSkills: [12304492],
      notFromCharacters: [],
    },
  },
  itemSkillMap: {},
}

describe("Issue #109: 美琪 旧IDインポート時の推論復元", () => {
  it("relatedSkillsに誤フォールバックせず、skillIndexから信号上書きを正しく復元する", async () => {
    const { result } = renderHook(() => useDeckBuilder(mockData))

    const presetFromDevice = {
      roleList: [10001393, -1, -1, -1, -1],
      header: 10001393,
      cardList: [
        { id: 10600574, ownerId: 10001393, skillId: 12304861, skillIndex: 3, useType: 1, useParam: -1, targetType: 0, equipIdList: [] },
        { id: 10600575, ownerId: 10001393, skillId: 12304859, skillIndex: 2, useType: 1, useParam: -1, targetType: 0, equipIdList: [] },
        { id: 10600572, ownerId: 10001393, skillId: 12304492, useType: 1, useParam: -1, targetType: 0, equipIdList: [] },
        { id: 10600573, ownerId: 10001393, skillId: 12304489, skillIndex: 1, useType: 1, useParam: -1, targetType: 0, equipIdList: [] },
      ],
      isLeaderCardOn: true,
      isSpCardOn: true,
      keepCardNum: 0,
      discardType: 1,
      otherCard: 0,
    }

    act(() => {
      const importResult = result.current.importPresetObject(presetFromDevice as never)
      expect(importResult.success).toBe(true)
    })

    await waitFor(() => {
      expect(result.current.selectedCards.length).toBeGreaterThan(0)
    })

    const meiqiCardIds = result.current.selectedCards
      .map((card) => String(card.id))
      .filter((id) => ["10600571", "10600572", "10600573", "10600574"].includes(id))

    expect(meiqiCardIds).toEqual(["10600574", "10600571", "10600572", "10600573"])
  })
})
