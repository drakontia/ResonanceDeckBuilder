import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

describe("Character 10001377 (エミール / Emilie)", () => {
  it("charDb / charSkillMap / skillDb / cardDb が整合している", async () => {
    const { characters } = await import("@/lib/charDb")
    const { charSkillMap } = await import("@/lib/charSkillMap")
    const { skills } = await import("@/lib/skillDb")
    const { cards } = await import("@/lib/cardDb")

    const char = characters["10001377"]
    expect(char).toBeDefined()
    expect(char.id).toBe(10001377)
    expect(char.quality).toBe("FiveStar")
    expect(char.line).toBe(1)
    expect(char.subLine).toBe(930)
    expect(char.identity).toBe("char.10001377.identity")
    expect(char.ability).toBe("char.10001377.ability")

    const expectedSkills = [12304970, 12304976, 12304977]
    expect(char.skillList?.map((entry) => entry.skillId)).toEqual(expectedSkills)
    expect(char.skillList?.map((entry) => entry.num)).toEqual([3, 1, 1])
    expect(charSkillMap["10001377"].skills).toEqual(expectedSkills)
    expect(charSkillMap["10001377"].relatedSkills).toEqual([])

    expect(skills["12304970"].cardID).toBe(10600610)
    expect(skills["12304976"].cardID).toBe(10600609)
    expect(skills["12304977"].cardID).toBe(10600608)
    expect(skills["12304977"].leaderCardConditionDesc).toBe("skill.12304977.leaderCardConditionDesc")

    expect(cards["10600610"].color).toBe("Red")
    expect(cards["10600610"].cost_SN).toBe(20000)
    expect(cards["10600609"].color).toBe("Purple")
    expect(cards["10600609"].cost_SN).toBe(30000)
    expect(cards["10600608"].color).toBe("Purple")
    expect(cards["10600608"].cardType).toBe("Special")
    expect(cards["10600608"].cost_SN).toBe(60000)
  })

  it("talent / breakthrough / homeSkill の件数とIDが正しい", async () => {
    const { characters } = await import("@/lib/charDb")
    const { talents } = await import("@/lib/talentDb")
    const { breakthroughs } = await import("@/lib/breakDb")
    const { homeSkills } = await import("@/lib/homeSkillDb")

    const char = characters["10001377"]
    const talentIds = char.talentList?.map((entry) => entry.talentId) ?? []
    const breakIds = char.breakthroughList?.map((entry) => entry.breakthroughId) ?? []
    const homeIds = char.homeSkillList?.map((entry) => entry.id) ?? []

    expect(talentIds).toEqual([12824021, 12824022, 12824023, 12824024, 12824025])
    expect(breakIds).toEqual([12101529, 12101524, 12101525, 12101526, 12101527, 12101528])
    expect(homeIds).toEqual([83900308, 83900309, 83900310])

    talentIds.forEach((id) => expect(talents[id.toString()]).toBeDefined())
    breakIds.forEach((id) => expect(breakthroughs[id.toString()]).toBeDefined())
    homeIds.forEach((id) => expect(homeSkills[id.toString()]).toBeDefined())

    expect(breakthroughs["12101529"].attributeList).toEqual([])
    expect(breakthroughs["12101527"].attributeList).toHaveLength(3)

    expect(homeSkills["83900308"].param).toBe(0.02)
    expect(homeSkills["83900309"].param).toBe(0.2)
    expect(homeSkills["83900310"].param).toBe(0.3)
  })

  it("imgDb と 5言語 messages に必要キーが存在する", async () => {
    const { images } = await import("@/lib/imgDb")
    const root = process.cwd()
    const locales = ["jp", "en", "ko", "cn", "tw"] as const

    expect(images["char_10001377"]).toBe("https://patchwiki.biligame.com/images/resonance/1/11/sidbruzq6jfdm30kcfodu0emj41w37l.png")
    ;["12304970", "12304976", "12304977"].forEach((id) => {
      expect(images[`skill_${id}`]).toBeDefined()
    })
    ;["12824021", "12824022", "12824023", "12824024", "12824025"].forEach((id) => {
      expect(images[`talent_${id}`]).toBeDefined()
    })
    ;["12101524", "12101525", "12101526", "12101527", "12101528", "12101529"].forEach((id) => {
      expect(images[`break_${id}`]).toBeDefined()
    })

    locales.forEach((locale) => {
      const messagePath = join(root, "messages", `${locale}.json`)
      const json = JSON.parse(readFileSync(messagePath, "utf8")) as Record<string, Record<string, unknown>>
      const char = json.char["10001377"] as Record<string, unknown>
      const skill = json.skill["12304977"] as Record<string, unknown>

      expect(char).toBeDefined()
      expect(json.skill["12304970"]).toBeDefined()
      expect(json.skill["12304976"]).toBeDefined()
      expect(skill).toBeDefined()
      expect(skill.leaderCardConditionDesc).toBeDefined()
      expect(json.break["12101529"]).toBeDefined()
      expect(json.talent["12824025"]).toBeDefined()
      expect(json.home_skill["83900310"]).toBeDefined()
      expect(json.card["10600610"]).toBeDefined()
    })
  })
})
