import { describe, expect, it } from "vitest"

describe("Character 10001393 (美琪 / Meiqi)", () => {
  it("charDb にキャラクターが追加されている", async () => {
    const { characters } = await import("@/lib/charDb")
    const char = characters["10001393"]

    expect(char).toBeDefined()
    expect(char.id).toBe(10001393)
    expect(char.quality).toBe("FiveStar")
    expect(char.line).toBe(1)
  })

  it("基礎スキル3件が charDb と charSkillMap で一致する", async () => {
    const { characters } = await import("@/lib/charDb")
    const { charSkillMap } = await import("@/lib/charSkillMap")

    const char = characters["10001393"]
    expect(char.skillList?.map((s) => s.skillId)).toEqual([12304489, 12304490, 12304861])
    expect(charSkillMap["10001393"].skills).toEqual([12304489, 12304490, 12304861])
    expect(charSkillMap["10001393"].relatedSkills).toContain(12304492)
  })

  it("スキルとカードの対応が正しい", async () => {
    const { skills } = await import("@/lib/skillDb")
    const { cards } = await import("@/lib/cardDb")

    expect(skills["12304489"].cardID).toBe(10600573)
    expect(skills["12304490"].cardID).toBe(10600571)
    expect(skills["12304492"].cardID).toBe(10600572)
    expect(skills["12304861"].cardID).toBe(10600574)

    expect(cards["10600571"]).toBeDefined()
    expect(cards["10600572"]).toBeDefined()
    expect(cards["10600573"]).toBeDefined()
    expect(cards["10600574"]).toBeDefined()
  })

  it("得意技のリーダー条件キーが個別キーになっている", async () => {
    const { skills } = await import("@/lib/skillDb")
    expect(skills["12304861"].leaderCardConditionDesc).toBe("skill.12304861.leaderCardConditionDesc")
  })

  it("共鳴5件・覚醒6件・生活スキル3件が紐づいている", async () => {
    const { characters } = await import("@/lib/charDb")
    const { talents } = await import("@/lib/talentDb")
    const { breakthroughs } = await import("@/lib/breakDb")
    const { homeSkills } = await import("@/lib/homeSkillDb")

    const char = characters["10001393"]
    const talentIds = char.talentList?.map((t) => t.talentId.toString()) ?? []
    const breakIds = char.breakthroughList?.map((b) => b.breakthroughId.toString()) ?? []
    const homeIds = char.homeSkillList?.map((h) => h.id.toString()) ?? []

    expect(talentIds).toHaveLength(5)
    expect(breakIds).toHaveLength(6)
    expect(homeIds).toHaveLength(3)

    talentIds.forEach((id) => expect(talents[id]).toBeDefined())
    breakIds.forEach((id) => expect(breakthroughs[id]).toBeDefined())
    homeIds.forEach((id) => expect(homeSkills[id]).toBeDefined())
  })

  it("imgDb にキャラ画像と主要スキル画像が存在する", async () => {
    const { images } = await import("@/lib/imgDb")

    expect(images["char_10001393"]).toBe("https://patchwiki.biligame.com/images/resonance/e/e7/50629lpnfu11s1av23fw3d8jaav8umr.png")
    expect(images["skill_12304489"]).toBeDefined()
    expect(images["skill_12304490"]).toBeDefined()
    expect(images["skill_12304861"]).toBeDefined()
  })
})
