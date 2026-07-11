/** @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react"
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
    "10001356": {
      id: 10001356,
      name: "char.10001356.name",
      quality: "FiveStar",
      tk_SN: 0,
      skillList: [
        { num: 2, skillId: 12303430 },
        { num: 2, skillId: 12304494 },
        { num: 1, skillId: 12304495 },
      ],
    },
  },
  cards: {
    "10600576": { id: 10600576, name: "card.10600576.name", ExCondList: [], ExActList: [] },
    "10600577": { id: 10600577, name: "card.10600577.name", ExCondList: [], ExActList: [] },
    "10600578": { id: 10600578, name: "card.10600578.name", ExCondList: [], ExActList: [] },
    "10600579": { id: 10600579, name: "card.10600579.name", ExCondList: [], ExActList: [] },
    "10600580": { id: 10600580, name: "card.10600580.name", ExCondList: [], ExActList: [] },
    "10600581": { id: 10600581, name: "card.10600581.name", ExCondList: [], ExActList: [] },
    "10600582": { id: 10600582, name: "card.10600582.name", ExCondList: [], ExActList: [] },
    "10600583": { id: 10600583, name: "card.10600583.name", ExCondList: [], ExActList: [] },
  },
  skills: {
    "12303430": { id: 12303430, name: "skill.12303430.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600578 },
    "12304494": { id: 12304494, name: "skill.12304494.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600576 },
    "12304495": { id: 12304495, name: "skill.12304495.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600577 },
    "12304496": { id: 12304496, name: "skill.12304496.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600579 },
    "12304497": { id: 12304497, name: "skill.12304497.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600580 },
    "12304498": { id: 12304498, name: "skill.12304498.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600581 },
    "12304499": { id: 12304499, name: "skill.12304499.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600582 },
    "12304500": { id: 12304500, name: "skill.12304500.name", mod: "", description: "", detailDescription: "", ExSkillList: [], cardID: 10600583 },
  },
  breakthroughs: {},
  talents: {},
  images: {},
  charSkillMap: {
    "10001356": {
      skills: [12303430, 12304494, 12304495],
      relatedSkills: [12304496, 12304497, 12304498, 12304499, 12304500],
      notFromCharacters: [],
    },
  },
  itemSkillMap: {},
}

describe("Issue #110: ドロシー・ローズモーン派生カードのUI非表示", () => {
  it("対象5枚を availableCards と selectedCards から除外する", () => {
    const { result } = renderHook(() => useDeckBuilder(mockData))

    act(() => {
      result.current.addCharacter(10001356, 0)
    })

    const availableCardIds = result.current.availableCards.map((item) => Number(item.card.id))
    const selectedSkillIds = result.current.selectedCards
      .map((card) => card.skillId)
      .filter((skillId): skillId is number => typeof skillId === "number")

    expect(availableCardIds).toEqual(expect.arrayContaining([10600576, 10600577, 10600578]))
    expect(availableCardIds).not.toEqual(expect.arrayContaining([10600579, 10600580, 10600581, 10600582, 10600583]))

    expect(selectedSkillIds).toEqual(expect.arrayContaining([12303430, 12304494, 12304495]))
    expect(selectedSkillIds).not.toEqual(expect.arrayContaining([12304496, 12304497, 12304498, 12304499, 12304500]))
  })
})
