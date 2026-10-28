import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { breakthroughs } from "@/lib/breakDb"
import { cards } from "@/lib/cardDb"
import { characters } from "@/lib/charDb"
import { charSkillMap } from "@/lib/charSkillMap"
import { homeSkills } from "@/lib/homeSkillDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"
import { talents } from "@/lib/talentDb"

type LocaleMessages = {
  char: Record<string, { name: string; identity: string; ability: string }>
  skill: Record<string, {
    name?: string
    description?: string
    detailDescription?: string
    leaderCardConditionDesc?: string
  }>
  break: Record<string, { name: string; desc: string }>
  talent: Record<string, { name: string; desc: string }>
  home_skill: Record<string, { name: string; desc: string }>
  card: Record<string, { name: string }>
}

const locales = ["jp", "en", "ko", "cn", "tw"] as const
const talentIds = [12824041, 12824042, 12824043, 12824044, 12824045]
const breakthroughIds = [12101548, 12101549, 12101550, 12101551, 12101552, 12101553]
const homeSkillIds = [83900320, 83900321, 83900322]
const characterCardIds = [10600623, 10600624, 10600625, 10600626]

describe("Character 10001531 (朱月 / Akatsuki)", () => {
  it("キャラクターと基礎・派生スキルのIDが一致している", () => {
    const character = characters["10001531"]

    expect(character).toBeDefined()
    expect(character.id).toBe(10001531)
    expect(character.quality).toBe("FiveStar")
    expect(character.sideId).toBe(12600023)
    expect(character.line).toBe(1)
    expect(character.skillList.map(({ skillId }) => skillId)).toEqual([
      12305197,
      12305198,
      12305200,
    ])
    expect(character.skillList.map(({ num }) => num)).toEqual([2, 1, 1])
    expect(charSkillMap["10001531"].skills).toEqual([12305197, 12305198, 12305200])
    expect(charSkillMap["10001531"].relatedSkills).toEqual([12305199])
  })

  it("共有コードから復元したカードIDをスキルに割り当てている", () => {
    expect(skills["12305197"].cardID).toBe(10600623)
    expect(skills["12305198"].cardID).toBe(10600624)
    expect(skills["12305199"].cardID).toBe(10600625)
    expect(skills["12305200"].cardID).toBe(10600626)
    expect(characterCardIds.every((id) => cards[id.toString()] !== undefined)).toBe(true)
  })

  it("カード色・コストと得意技のリーダー条件が正しい", () => {
    expect(cards["10600623"]).toMatchObject({ color: "Purple", cost_SN: 30000 })
    expect(cards["10600624"]).toMatchObject({ color: "Yellow", cost_SN: 30000 })
    expect(cards["10600625"]).toMatchObject({ color: "Purple", cost_SN: 30000 })
    expect(cards["10600626"]).toMatchObject({
      color: "Purple",
      cost_SN: 50000,
      cardType: "Special",
    })
    expect(skills["12305200"].leaderCardConditionDesc).toBe(
      "skill.12305200.leaderCardConditionDesc",
    )
  })

  it("共鳴5件・覚醒6件・生活スキル3件を登録し、基本突破は属性なしにする", () => {
    const character = characters["10001531"]

    expect(character.talentList?.map(({ talentId }) => talentId)).toEqual(talentIds)
    expect(character.breakthroughList?.map(({ breakthroughId }) => breakthroughId)).toEqual(
      breakthroughIds,
    )
    expect(character.homeSkillList?.map(({ id }) => id)).toEqual(homeSkillIds)
    talentIds.forEach((id) => expect(talents[id.toString()]).toBeDefined())
    breakthroughIds.forEach((id) => expect(breakthroughs[id.toString()]).toBeDefined())
    homeSkillIds.forEach((id) => expect(homeSkills[id.toString()]).toBeDefined())
    expect(talentIds.map((id) => talents[id.toString()].awakeLv)).toEqual([1, 2, 3, 4, 5])
    expect(breakthroughs[breakthroughIds[0].toString()].attributeList).toEqual([])
  })

  it("闘志の数値と生活スキルの効果を登録する", () => {
    expect(breakthroughs["12101551"].attributeList).toEqual([
      { attributeType: "Atk", numType: "Number", num_SN: 150000000 },
      { attributeType: "Def", numType: "Number", num_SN: 150000000 },
      { attributeType: "Hp", numType: "Percent", num_SN: 150000 },
    ])
    expect(homeSkills["83900320"]).toMatchObject({ param: 0.2, homeSkillType: "AddSpecQty" })
    expect(homeSkills["83900321"]).toMatchObject({
      param: 0.03,
      homeSkillType: "AddEntrustReward",
    })
    expect(homeSkills["83900322"]).toMatchObject({ param: 0.3, homeSkillType: "AddSpecQty" })
  })

  it("キャラクター・スキル・共鳴・覚醒の画像を登録する", () => {
    expect(images["char_10001531"]).toBe(
      "https://patchwiki.biligame.com/images/resonance/c/c5/35q5vs47gndn955dtaz837sf7m2lytf.png",
    )
    for (const id of [12305197, 12305198, 12305199, 12305200]) {
      expect(images[`skill_${id}`]).toBeTruthy()
    }
    talentIds.forEach((id) => expect(images[`talent_${id}`]).toBeTruthy())
    breakthroughIds.slice(1).forEach((id) => expect(images[`break_${id}`]).toBeTruthy())
  })

  it.each(locales)("全データの翻訳キーが%sに揃っている", (locale) => {
    const messages = JSON.parse(
      readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
    ) as LocaleMessages

    expect(messages.char["10001531"]).toMatchObject({
      name: expect.any(String),
      identity: expect.any(String),
      ability: expect.any(String),
    })
    if (locale === "jp") {
      expect(messages.talent["12824043"].desc).toBe("HP+35%")
    }
    for (const id of [12305197, 12305198, 12305199, 12305200]) {
      expect(messages.skill[id.toString()]).toMatchObject({
        name: expect.any(String),
        description: expect.any(String),
        detailDescription: expect.any(String),
      })
    }
    expect(messages.skill["12305200"].leaderCardConditionDesc).toBeTruthy()
    breakthroughIds.forEach((id) => {
      expect(messages.break[id.toString()]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
      })
    })
    talentIds.forEach((id) => {
      expect(messages.talent[id.toString()]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
      })
    })
    homeSkillIds.forEach((id) => {
      expect(messages.home_skill[id.toString()]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
      })
    })
    characterCardIds.forEach((id) => {
      expect(messages.card[id.toString()]).toMatchObject({ name: expect.any(String) })
    })
  })
})
