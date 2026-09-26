import { describe, expect, it } from "vitest"

import { breakthroughs } from "@/lib/breakDb"
import { cards } from "@/lib/cardDb"
import { characters } from "@/lib/charDb"
import { charSkillMap } from "@/lib/charSkillMap"
import { homeSkills } from "@/lib/homeSkillDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"
import { talents } from "@/lib/talentDb"

describe("Character 10001478 (フェニーア・夢耀 / Fenia the Dream Glimmer)", () => {
  it("charDb にキャラクターが追加されている", () => {
    const char = characters["10001478"]

    expect(char).toBeDefined()
    expect(char.id).toBe(10001478)
    expect(char.quality).toBe("FiveStar")
  })

  it("基礎スキル3件が charDb と charSkillMap で一致し、派生2件が relatedSkills に含まれる", () => {
    const char = characters["10001478"]
    expect(char.skillList?.map((skill) => skill.skillId)).toEqual([12305048, 12305049, 12305050])
    expect(char.skillList?.map((skill) => skill.num)).toEqual([2, 2, 1])
    expect(charSkillMap["10001478"].skills).toEqual([12305048, 12305049, 12305050])
    expect(charSkillMap["10001478"].relatedSkills).toEqual([12305054, 12305055])
  })

  it("スキルとカードの対応が正しい", () => {
    expect(skills["12305048"].cardID).toBe(10600614)
    expect(skills["12305054"].cardID).toBe(10600615)
    expect(skills["12305055"].cardID).toBe(10600616)
    expect(skills["12305049"].cardID).toBe(10600617)
    expect(skills["12305050"].cardID).toBe(10600618)

    expect(cards["10600614"]).toBeDefined()
    expect(cards["10600615"]).toBeDefined()
    expect(cards["10600616"]).toBeDefined()
    expect(cards["10600617"]).toBeDefined()
    expect(cards["10600618"]).toBeDefined()
  })

  it("カードのコストが cost_SN(値×10,000)で正しく設定されている", () => {
    expect(cards["10600614"].cost_SN).toBe(30000)
    expect(cards["10600615"].cost_SN).toBe(30000)
    expect(cards["10600616"].cost_SN).toBe(30000)
    expect(cards["10600617"].cost_SN).toBe(0)
    expect(cards["10600618"].cost_SN).toBe(70000)
  })

  it("得意技カードは Special / S サフィックスになっている", () => {
    expect(cards["10600618"].cardType).toBe("Special")
    expect(cards["10600618"].idCN).toMatch(/\/S$/)
  })

  it("得意技のリーダー条件キーが個別キーになっている", () => {
    expect(skills["12305050"].leaderCardConditionDesc).toBe("skill.12305050.leaderCardConditionDesc")
  })

  it("雷の楔に手札数≦(0〜11)の優先度オプションがある", () => {
    const card = cards["10600615"]
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

  it("雷よ、来たれに手札数≦(0〜11)と手札数＞(0〜11)の優先度オプションがある", () => {
    const card = cards["10600616"]
    const actionOptions = card.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80608005, 80608004])

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
    expect(actionOptions[1]).toEqual(
      expect.objectContaining({
        des: 80608004,
        isNumCond: true,
        minNum: 0,
        interValNum: 12,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })

  it("雷の源に現在使用可能のコスト＜(0〜29)の優先度オプションがある", () => {
    const card = cards["10600617"]
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
    const char = characters["10001478"]
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

  it("覚醒3(闘志)に攻撃力+150/防御力+150/HP+15%の属性が設定されている", () => {
    const char = characters["10001478"]
    const breakIds = char.breakthroughList?.map((breakthrough) => breakthrough.breakthroughId.toString()) ?? []
    const break3 = breakthroughs[breakIds[3]]

    expect(break3.attributeList).toEqual([
      { attributeType: "Atk", numType: "Number", num_SN: 150000000 },
      { attributeType: "Def", numType: "Number", num_SN: 150000000 },
      { attributeType: "Hp", numType: "Percent", num_SN: 150000 },
    ])
  })

  it("生活スキルの共鳴段階1/4/5と param が正しい", () => {
    const char = characters["10001478"]
    const homeSkillList = char.homeSkillList ?? []

    expect(homeSkillList.map((h) => h.resonanceLv)).toEqual([1, 4, 5])
    expect(homeSkills[homeSkillList[0].id.toString()].param).toBe(0.2)
    expect(homeSkills[homeSkillList[0].id.toString()].homeSkillType).toBe("AddSpecQty")
    expect(homeSkills[homeSkillList[1].id.toString()].param).toBe(5)
    expect(homeSkills[homeSkillList[1].id.toString()].homeSkillType).toBe("AddSpeed")
    expect(homeSkills[homeSkillList[2].id.toString()].param).toBe(0.3)
    expect(homeSkills[homeSkillList[2].id.toString()].homeSkillType).toBe("AddSpecQty")
  })

  it("imgDb にキャラ画像と主要スキル画像が存在する", () => {
    expect(images["char_10001478"]).toBeDefined()
    expect(images["skill_12305048"]).toBeDefined()
    expect(images["skill_12305049"]).toBeDefined()
    expect(images["skill_12305050"]).toBeDefined()
    expect(images["skill_12305054"]).toBeDefined()
    expect(images["skill_12305055"]).toBeDefined()
  })
})
