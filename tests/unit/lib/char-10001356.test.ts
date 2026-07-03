import { describe, expect, it } from "vitest"

import { breakthroughs } from "@/lib/breakDb"
import { cards } from "@/lib/cardDb"
import { characters } from "@/lib/charDb"
import { charSkillMap } from "@/lib/charSkillMap"
import { homeSkills } from "@/lib/homeSkillDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"
import { talents } from "@/lib/talentDb"

describe("Character 10001356 (ドロシー・ローズモーン / Dorothy Rosymorn)", () => {
  it("charDb にキャラクターが追加されている", () => {
    const char = characters["10001356"]

    expect(char).toBeDefined()
    expect(char.id).toBe(10001356)
    expect(char.quality).toBe("FiveStar")
    expect(char.line).toBe(3)
  })

  it("基礎スキル3件が charDb と charSkillMap で一致する", () => {
    const char = characters["10001356"]
    expect(char.skillList?.map((skill) => skill.skillId)).toEqual([12303430, 12304494, 12304495])
    expect(charSkillMap["10001356"].skills).toEqual([12303430, 12304494, 12304495])
    expect(charSkillMap["10001356"].relatedSkills).toEqual([
      12304496,
      12304497,
      12304498,
      12304499,
      12304500,
    ])
  })

  it("スキルとカードの対応が正しい", () => {
    expect(skills["12303430"].cardID).toBe(10600578)
    expect(skills["12304494"].cardID).toBe(10600576)
    expect(skills["12304495"].cardID).toBe(10600577)
    expect(skills["12304496"].cardID).toBe(10600579)
    expect(skills["12304500"].cardID).toBe(10600583)

    expect(cards["10600576"]).toBeDefined()
    expect(cards["10600577"]).toBeDefined()
    expect(cards["10600578"]).toBeDefined()
    expect(cards["10600579"]).toBeDefined()
    expect(cards["10600583"]).toBeDefined()
  })

  it("得意技のリーダー条件キーが個別キーになっている", () => {
    expect(skills["12304495"].leaderCardConditionDesc).toBe("skill.12304495.leaderCardConditionDesc")
  })

  it("優先度オプションなしの指示どおり基礎カードに ExActList を持たない", () => {
    expect(cards["10600576"].ExActList ?? []).toEqual([])
    expect(cards["10600577"].ExActList ?? []).toEqual([])
    expect(cards["10600578"].ExActList ?? []).toEqual([])
  })

  it("共鳴5件・覚醒6件・生活スキル3件が紐づいており、基礎覚醒は属性なし", () => {
    const char = characters["10001356"]
    const talentIds = char.talentList?.map((talent) => talent.talentId.toString()) ?? []
    const breakIds = char.breakthroughList?.map((breakthrough) => breakthrough.breakthroughId.toString()) ?? []
    const homeIds = char.homeSkillList?.map((homeSkill) => homeSkill.id.toString()) ?? []

    expect(talentIds).toHaveLength(5)
    expect(breakIds).toHaveLength(6)
    expect(homeIds).toHaveLength(3)

    talentIds.forEach((id) => expect(talents[id]).toBeDefined())
    breakIds.forEach((id) => expect(breakthroughs[id]).toBeDefined())
    homeIds.forEach((id) => expect(homeSkills[id]).toBeDefined())
    expect(breakthroughs[breakIds[0]].attributeList).toEqual([])
  })

  it("imgDb にキャラ画像と基礎/派生スキル画像が存在する", () => {
    expect(images["char_10001356"]).toBe("https://patchwiki.biligame.com/images/resonance/a/a4/lnarkdk0eeipsscswzjeeqm62yv7ktn.png")
    expect(images["skill_12303430"]).toBeDefined()
    expect(images["skill_12304494"]).toBeDefined()
    expect(images["skill_12304495"]).toBeDefined()
    expect(images["skill_12304496"]).toBeDefined()
    expect(images["skill_12304500"]).toBeDefined()
  })
})
