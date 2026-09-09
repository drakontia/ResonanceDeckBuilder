import { describe, expect, it } from "vitest"

import { breakthroughs } from "@/lib/breakDb"
import { cards } from "@/lib/cardDb"
import { characters } from "@/lib/charDb"
import { charSkillMap } from "@/lib/charSkillMap"
import { homeSkills } from "@/lib/homeSkillDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"
import { talents } from "@/lib/talentDb"

describe("Character 10000854 (ジェス＆シモン / Jessy＆Simon)", () => {
  it("charDb にキャラクターが追加されている", () => {
    const char = characters["10000854"]

    expect(char).toBeDefined()
    expect(char.id).toBe(10000854)
    expect(char.quality).toBe("FiveStar")
  })

  it("基礎スキル3件が charDb と charSkillMap で一致する", () => {
    const char = characters["10000854"]
    expect(char.skillList?.map((skill) => skill.skillId)).toEqual([12305012, 12305013, 12305014])
    expect(charSkillMap["10000854"].skills).toEqual([12305012, 12305013, 12305014])
    expect(charSkillMap["10000854"].relatedSkills).toEqual([])
  })

  it("スキルとカードの対応が正しい", () => {
    expect(skills["12305012"].cardID).toBe(10600611)
    expect(skills["12305013"].cardID).toBe(10600612)
    expect(skills["12305014"].cardID).toBe(10600613)

    expect(cards["10600611"]).toBeDefined()
    expect(cards["10600612"]).toBeDefined()
    expect(cards["10600613"]).toBeDefined()
  })

  it("カードのコストが cost_SN(値×10,000)で正しく設定されている", () => {
    expect(cards["10600611"].cost_SN).toBe(20000)
    expect(cards["10600612"].cost_SN).toBe(30000)
    expect(cards["10600613"].cost_SN).toBe(50000)
  })

  it("得意技のリーダー条件キーが個別キーになっている", () => {
    expect(skills["12305014"].leaderCardConditionDesc).toBe("skill.12305014.leaderCardConditionDesc")
  })

  it("場内増資に手札数(0〜11)の優先度オプションがある", () => {
    const card = cards["10600612"]
    const actionOptions = card.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80608005])

    expect(actionOptions[0]).toEqual(
      expect.objectContaining({
        des: 80608005,
        isNumCond: true,
        minNum: 0,
        interValNum: 12,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })

  it("エターナル清算に現在使用可能のコスト(0〜29)の優先度オプションがある", () => {
    const card = cards["10600613"]
    const actionOptions = card.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80608007])

    expect(actionOptions[0]).toEqual(
      expect.objectContaining({
        des: 80608007,
        isNumCond: true,
        minNum: 0,
        interValNum: 30,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })

  it("共鳴5件・覚醒6件・生活スキル3件が紐づいており、基礎覚醒は属性なし", () => {
    const char = characters["10000854"]
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

  it("imgDb にキャラ画像と主要スキル画像が存在する", () => {
    expect(images["char_10000854"]).toBeDefined()
    expect(images["skill_12305012"]).toBeDefined()
    expect(images["skill_12305013"]).toBeDefined()
    expect(images["skill_12305014"]).toBeDefined()
  })
})
