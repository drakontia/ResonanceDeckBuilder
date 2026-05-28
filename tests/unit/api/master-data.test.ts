import { describe, expect, it, vi } from "vitest"

// API Route のテスト: GET /api/master-data が Database 形状の JSON を返すことを確認
vi.mock("@/lib/breakDb", () => ({ breakthroughs: {} }))
vi.mock("@/lib/cardDb", () => ({ cards: { "1": { id: 1, name: "card.1.name" } } }))
vi.mock("@/lib/charDb", () => ({
  characters: {
    "1": { id: 1, name: "char.1.name", quality: "FiveStar", skillList: [], tk_SN: 0 },
  },
}))
vi.mock("@/lib/charSkillMap", () => ({ charSkillMap: { "1": { skills: [], relatedSkills: [], notFromCharacters: [] } } }))
vi.mock("@/lib/equipDb", () => ({
  equipments: {
    "10": { id: 10, name: "Sword", des: "", equipTagId: 12600155, quality: "R" },
  },
}))
vi.mock("@/lib/homeSkillDb", () => ({ homeSkills: {} }))
vi.mock("@/lib/imgDb", () => ({ images: { char_1: "char-url" } }))
vi.mock("@/lib/itemSkillMap", () => ({ itemSkillMap: {} }))
vi.mock("@/lib/skillDb", () => ({ skills: {} }))
vi.mock("@/lib/talentDb", () => ({ talents: {} }))

describe("GET /api/master-data", () => {
  it("200 を返し Database 形状の JSON を含む", async () => {
    const { GET } = await import("@/app/api/master-data/route")
    const response = await GET()

    expect(response.status).toBe(200)

    const json = await response.json()

    expect(json).toHaveProperty("characters")
    expect(json).toHaveProperty("cards")
    expect(json).toHaveProperty("skills")
    expect(json).toHaveProperty("breakthroughs")
    expect(json).toHaveProperty("talents")
    expect(json).toHaveProperty("images")
    expect(json).toHaveProperty("equipments")
  })

  it("キャラクターに SSR rarity が付与されている", async () => {
    const { GET } = await import("@/app/api/master-data/route")
    const response = await GET()
    const json = await response.json()

    expect(json.characters["1"].rarity).toBe("SSR")
  })

  it("Content-Type が application/json である", async () => {
    const { GET } = await import("@/app/api/master-data/route")
    const response = await GET()

    expect(response.headers.get("Content-Type")).toContain("application/json")
  })
})
