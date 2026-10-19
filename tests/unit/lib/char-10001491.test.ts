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

describe("Character 10001491 (アリナ・愛執 / Arina the Fatal Allure)", () => {
  it("キャラクターと3つの基礎スキルが登録されている", () => {
    const char = characters["10001491"]

    expect(char).toBeDefined()
    expect(char.id).toBe(10001491)
    expect(char.quality).toBe("FiveStar")
    expect(char.sideId).toBe(12600023)
    expect(char.line).toBe(1)
    expect(char.skillList?.map(({ skillId }) => skillId)).toEqual([12305157, 12305158, 12305160])
    expect(char.skillList?.map(({ num }) => num)).toEqual([3, 2, 1])
    expect(charSkillMap["10001491"].skills).toEqual([12305157, 12305158, 12305160])
    expect(charSkillMap["10001491"].relatedSkills).toEqual([12305159])
  })

  it("スキルと派生カードがIssueから復元したIDで対応している", () => {
    expect(skills["12305157"].cardID).toBe(10600619)
    expect(skills["12305158"].cardID).toBe(10600620)
    expect(skills["12305159"].cardID).toBe(10600621)
    expect(skills["12305160"].cardID).toBe(10600622)

    expect(cards["10600619"]).toBeDefined()
    expect(cards["10600620"]).toBeDefined()
    expect(cards["10600621"]).toBeDefined()
    expect(cards["10600622"]).toBeDefined()
  })

  it("カード色・コストと得意技のリーダー条件が正しい", () => {
    expect(cards["10600619"]).toMatchObject({ color: "Purple", cost_SN: 20000 })
    expect(cards["10600620"]).toMatchObject({ color: "Yellow", cost_SN: 30000 })
    expect(cards["10600621"]).toMatchObject({ color: "Black", cost_SN: 0 })
    expect(cards["10600622"]).toMatchObject({ color: "Purple", cost_SN: 60000, cardType: "Special" })
    expect(skills["12305160"].leaderCardConditionDesc).toBe("skill.12305160.leaderCardConditionDesc")
  })

  it("共鳴5件・覚醒6件・生活スキル3件を紐づけ、基本突破を属性なしにする", () => {
    const char = characters["10001491"]
    const talentIds = char.talentList?.map(({ talentId }) => talentId.toString()) ?? []
    const breakIds = char.breakthroughList?.map(({ breakthroughId }) => breakthroughId.toString()) ?? []
    const homeIds = char.homeSkillList?.map(({ id }) => id.toString()) ?? []

    expect(talentIds).toHaveLength(5)
    expect(breakIds).toHaveLength(6)
    expect(homeIds).toHaveLength(3)

    talentIds.forEach((id) => expect(talents[id]).toBeDefined())
    breakIds.forEach((id) => expect(breakthroughs[id]).toBeDefined())
    homeIds.forEach((id) => expect(homeSkills[id]).toBeDefined())
    expect(breakthroughs[breakIds[0]].attributeList).toEqual([])
  })

  it("闘志のステータス上昇と生活スキルの効果値を設定する", () => {
    const char = characters["10001491"]
    const breakIds = char.breakthroughList?.map(({ breakthroughId }) => breakthroughId.toString()) ?? []
    const homeIds = char.homeSkillList?.map(({ id }) => id.toString()) ?? []

    expect(breakthroughs[breakIds[3]].attributeList).toEqual([
      { attributeType: "Atk", numType: "Number", num_SN: 150000000 },
      { attributeType: "Def", numType: "Number", num_SN: 150000000 },
      { attributeType: "Hp", numType: "Percent", num_SN: 150000 },
    ])
    expect(homeSkills[homeIds[0]]).toMatchObject({ param: 3, homeSkillType: "AddSpecQty" })
    expect(homeSkills[homeIds[1]]).toMatchObject({ param: 0.03, homeSkillType: "AddPassengerGains" })
    expect(homeSkills[homeIds[2]]).toMatchObject({ param: 0.05, homeSkillType: "AddPassengerGains" })
  })

  it("キャラクター画像と基礎・派生スキル画像を登録する", () => {
    expect(images["char_10001491"]).toBe(
      "https://patchwiki.biligame.com/images/resonance/d/d4/s5wxcoy53zqahz5owplcfciuaivfwou.png",
    )
    expect(images["skill_12305157"]).toBeDefined()
    expect(images["skill_12305158"]).toBeDefined()
    expect(images["skill_12305159"]).toBeDefined()
    expect(images["skill_12305160"]).toBeDefined()
    for (const id of [12824036, 12824037, 12824038, 12824039, 12824040]) {
      expect(images[`talent_${id}`]).toBeDefined()
    }
    for (const id of [12101543, 12101544, 12101545, 12101546, 12101547]) {
      expect(images[`break_${id}`]).toBeDefined()
    }
  })

  it.each(locales)("全データの翻訳キーが%sに揃っている", (locale) => {
    const messages = JSON.parse(
      readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
    ) as LocaleMessages

    expect(messages.char["10001491"]).toMatchObject({
      name: expect.any(String),
      identity: expect.any(String),
      ability: expect.any(String),
    })
    expect(messages.char["10001491"].ability).toMatch(/[?？]/)
    expect(messages.skill["12305157"]?.description).toBeTruthy()
    expect(messages.skill["12305158"]?.description).toBeTruthy()
    expect(messages.skill["12305159"]?.description).toBeTruthy()
    expect(messages.skill["12305160"]?.leaderCardConditionDesc).toBeTruthy()
    for (const id of [12101542, 12101543, 12101544, 12101545, 12101546, 12101547]) {
      expect(messages.break[id.toString()]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
      })
    }
    for (const id of [12824036, 12824037, 12824038, 12824039, 12824040]) {
      expect(messages.talent[id.toString()]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
      })
    }
    for (const id of [83900317, 83900318, 83900319]) {
      expect(messages.home_skill[id.toString()]).toMatchObject({
        name: expect.any(String),
        desc: expect.any(String),
      })
    }
    for (const id of [10600619, 10600620, 10600621, 10600622]) {
      expect(messages.card[id.toString()]).toMatchObject({ name: expect.any(String) })
    }
  })
})
