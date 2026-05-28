import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/breakDb", () => ({ breakthroughs: {} }))
vi.mock("@/lib/cardDb", () => ({ cards: {} }))
vi.mock("@/lib/charDb", () => ({
  characters: {
    "1": {
      id: 1,
      name: "char.1.name",
      quality: "threeStar",
      skillList: [],
      tk_SN: 0,
      identity: "hero_identity",
    },
    "2": {
      id: 2,
      name: "char.2.name",
      quality: "FiveStar",
      skillList: [],
      tk_SN: 0,
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
      skillList: { a: { skillId: 5 } },
    },
    "20": {
      id: 20,
      name: "Armor",
      des: "",
      equipTagId: 12600161,
      quality: "SR",
    },
    "30": {
      id: 30,
      name: "Accessory",
      des: "",
      equipTagId: 12600162,
      quality: "SSR",
    },
  },
}))
vi.mock("@/lib/homeSkillDb", () => ({ homeSkills: {} }))
vi.mock("@/lib/imgDb", () => ({
  images: {
    char_1: "char-1-url",
    equip_10: "equip-10-url",
  },
}))
vi.mock("@/lib/itemSkillMap", () => ({ itemSkillMap: {} }))
vi.mock("@/lib/skillDb", () => ({ skills: {} }))
vi.mock("@/lib/talentDb", () => ({ talents: {} }))

describe("buildDatabase", () => {
  it("キャラクターに画像URLを付与する", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    expect(db.characters["1"].img_card).toBe("char-1-url")
    expect(db.characters["2"].img_card).toBeUndefined()
  })

  it("quality から rarity をマッピングする", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    expect(db.characters["1"].rarity).toBe("R")
    expect(db.characters["2"].rarity).toBe("SSR")
  })

  it("identity が desc にフォールバックする", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    expect(db.characters["1"].desc).toBe("hero_identity")
    expect(db.characters["2"].desc).toBe("char_desc_2")
  })

  it("装備タイプを equipTagId から判定する", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    expect(db.equipments?.["10"].type).toBe("weapon")
    expect(db.equipments?.["20"].type).toBe("armor")
    expect(db.equipments?.["30"].type).toBe("accessory")
  })

  it("装備に画像URLを付与する", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    expect(db.equipments?.["10"].url).toBe("equip-10-url")
  })

  it("装備の skillList がオブジェクト形式の場合、配列に変換する", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    const skillList = db.equipments?.["10"].skillList
    expect(Array.isArray(skillList)).toBe(true)
    expect(skillList?.[0].skillId).toBe(5)
  })

  it("Database の基本フィールドが揃っている", async () => {
    const { buildDatabase } = await import("@/lib/masterData")
    const db = buildDatabase()
    expect(db).toHaveProperty("characters")
    expect(db).toHaveProperty("cards")
    expect(db).toHaveProperty("skills")
    expect(db).toHaveProperty("breakthroughs")
    expect(db).toHaveProperty("talents")
    expect(db).toHaveProperty("images")
    expect(db).toHaveProperty("equipments")
    expect(db).toHaveProperty("charSkillMap")
    expect(db).toHaveProperty("itemSkillMap")
  })
})
