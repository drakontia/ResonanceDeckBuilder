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
const skillIds = [12305224, 12305225, 12305226]
const cardIds = [10600630, 10600631, 10600632]
const talentIds = [12824046, 12824047, 12824048, 12824049, 12824050]
const breakthroughIds = [12101554, 12101555, 12101556, 12101557, 12101558, 12101559]
const homeSkillIds = [83900323, 83900324, 83900325]

describe("Character 10001533 (紅ずきん / Red Hood)", () => {
  it("キャラクターとスキルのID・数量・基本情報が一致している", () => {
    const character = characters["10001533"]

    expect(character).toMatchObject({
      id: 10001533,
      quality: "FiveStar",
      sideId: 12600023,
      line: 1,
      hp_SN: 75200000000,
      atk_SN: 846000000,
      def_SN: 705000000,
      skillList: [
        { num: 3, skillId: skillIds[0] },
        { num: 1, skillId: skillIds[1] },
        { num: 1, skillId: skillIds[2] },
      ],
    })
    expect(charSkillMap["10001533"].skills).toEqual(skillIds)
    expect(charSkillMap["10001533"].relatedSkills).toEqual([])
  })

  it("コードで復元したカードIDを正しい色・コスト・得意技種別に割り当てる", () => {
    expect(skillIds.map((id) => skills[id.toString()].cardID)).toEqual([
      10600632,
      10600631,
      10600630,
    ])
    expect(cards["10600632"]).toMatchObject({ color: "Red", cost_SN: 20000, cardType: "Normal" })
    expect(cards["10600631"]).toMatchObject({ color: "Purple", cost_SN: 30000, cardType: "Normal" })
    expect(cards["10600630"]).toMatchObject({ color: "Red", cost_SN: 50000, cardType: "Special" })
    expect(skills["12305226"].leaderCardConditionDesc).toBe(
      "skill.12305226.leaderCardConditionDesc",
    )
  })

  it("共鳴5件・突破6件・生活スキル3件を登録し、基本突破は属性なしにする", () => {
    const character = characters["10001533"]

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
    expect(breakthroughs["12101557"].attributeList).toEqual([
      { attributeType: "Atk", numType: "Number", num_SN: 150000000 },
      { attributeType: "Def", numType: "Number", num_SN: 150000000 },
      { attributeType: "Hp", numType: "Percent", num_SN: 150000 },
    ])
  })

  it("生活スキルの効果量と種類が正しい", () => {
    expect(homeSkills["83900323"]).toMatchObject({
      param: 0.03,
      homeSkillType: "AddEntrustReward",
    })
    expect(homeSkills["83900324"]).toMatchObject({
      param: 0.2,
      homeSkillType: "AddSpecQty",
    })
    expect(homeSkills["83900325"]).toMatchObject({
      param: 0.05,
      homeSkillType: "AddEntrustReward",
    })
  })

  it("キャラクター画像と各スキル・共鳴・覚醒画像を登録する", () => {
    expect(images["char_10001533"]).toBe(
      "https://resonance.wikiru.jp/attach2/E7B485E3819AE3818DE38293_E7B485E3819AE3818DE382935F48616C662E706E67.png",
    )
    skillIds.forEach((id) => expect(images[`skill_${id}`]).toBeTruthy())
    talentIds.forEach((id) => expect(images[`talent_${id}`]).toBeTruthy())
    breakthroughIds.slice(1).forEach((id) => expect(images[`break_${id}`]).toBeTruthy())
  })

  it.each(locales)("必須の翻訳キーが%sに揃っている", (locale) => {
    const messages = JSON.parse(
      readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
    ) as LocaleMessages

    expect(messages.char["10001533"]).toMatchObject({
      name: expect.any(String),
      identity: expect.any(String),
      ability: expect.any(String),
    })
    if (locale === "jp") {
      expect(messages.char["10001533"]).toEqual({
        name: "紅ずきん",
        identity: "旅人",
        ability: "不明",
      })
      expect(messages.skill["12305224"].detailDescription).toContain("3000%（暗黒）")
      expect(messages.skill["12305226"].leaderCardConditionDesc).toBe(
        "クールダウン：30秒。カードを1枚使用するたび、クールダウン-6秒",
      )
      expect(messages.talent["12824048"].desc).toBe("HP+35%")
    }
    skillIds.forEach((id) => {
      expect(messages.skill[id.toString()]).toMatchObject({
        name: expect.any(String),
        description: expect.any(String),
        detailDescription: expect.any(String),
      })
    })
    expect(messages.skill["12305226"].leaderCardConditionDesc).toBeTruthy()
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
    cardIds.forEach((id) => expect(messages.card[id.toString()]).toMatchObject({ name: expect.any(String) }))
  })
})
