import { describe, expect, it } from "vitest"

import { breakthroughs } from "@/lib/breakDb"
import { cards } from "@/lib/cardDb"
import { characters } from "@/lib/charDb"
import { charSkillMap } from "@/lib/charSkillMap"
import { homeSkills } from "@/lib/homeSkillDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"
import { talents } from "@/lib/talentDb"

describe("Character 10001357 (イローナ・トワイライト / Ilona Twilight)", () => {
  it("charDb にキャラクターが追加されている", () => {
    const char = characters["10001357"]

    expect(char).toBeDefined()
    expect(char.id).toBe(10001357)
    expect(char.quality).toBe("FiveStar")
    expect(char.line).toBe(3)
  })

  it("基礎スキル3件が charDb と charSkillMap で一致する", () => {
    const char = characters["10001357"]
    expect(char.skillList?.map((skill) => skill.skillId)).toEqual([12304849, 12304896, 12304851])
    expect(charSkillMap["10001357"].skills).toEqual([12304849, 12304896, 12304851])
    expect(charSkillMap["10001357"].relatedSkills).toEqual([])
  })

  it("スキルとカードの対応が正しい", () => {
    expect(skills["12304849"].cardID).toBe(10600584)
    expect(skills["12304896"].cardID).toBe(10600588)
    expect(skills["12304851"].cardID).toBe(10600586)

    expect(cards["10600584"]).toBeDefined()
    expect(cards["10600588"]).toBeDefined()
    expect(cards["10600586"]).toBeDefined()
  })

  it("得意技のリーダー条件キーが個別キーになっている", () => {
    expect(skills["12304851"].leaderCardConditionDesc).toBe("skill.12304851.leaderCardConditionDesc")
  })

  it("咲き誇る百合の花に手札数(0〜11)の優先度オプションがある", () => {
    const card = cards["10600588"]
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

  it("共鳴5件・覚醒6件・生活スキル3件が紐づいており、基礎覚醒は属性なし", () => {
    const char = characters["10001357"]
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
    expect(images["char_10001357"]).toBe("https://patchwiki.biligame.com/images/resonance/5/56/k22u9mgqakfof3wxvgz4iqrtn2hqec1.png")
    expect(images["skill_12304849"]).toBeDefined()
    expect(images["skill_12304896"]).toBeDefined()
    expect(images["skill_12304851"]).toBeDefined()
  })
})
