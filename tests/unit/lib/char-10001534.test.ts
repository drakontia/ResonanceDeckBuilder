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
const skillIds = [12305238, 12305239, 12305240, 12305241, 12305242, 12305243]
const primarySkillIds = [12305238, 12305242, 12305243]
const cardIds = [10600633, 10600634, 10600635, 10600636, 10600637, 10600638]
const talentIds = [12824051, 12824052, 12824053, 12824054, 12824055]
const breakthroughIds = [12101560, 12101561, 12101562, 12101563, 12101564, 12101565]
const homeSkillIds = [83900326, 83900327, 83900328]

describe("Character 10001534 (Alice)", () => {
  it("キャラクター・基礎スキル・派生スキルのIDと数量が一致している", () => {
    const character = characters["10001534"]

    expect(character).toMatchObject({
      id: 10001534,
      quality: "FiveStar",
      sideId: 12600023,
      line: 2,
      hp_SN: 75200000000,
      atk_SN: 846000000,
      def_SN: 705000000,
      skillList: [
        { num: 3, skillId: primarySkillIds[0] },
        { num: 1, skillId: primarySkillIds[1] },
        { num: 1, skillId: primarySkillIds[2] },
      ],
    })
    expect(character.hp_SN).toBeGreaterThan(0)
    expect(character.atk_SN).toBeGreaterThan(0)
    expect(character.def_SN).toBeGreaterThan(0)
    expect(charSkillMap["10001534"].skills).toEqual(primarySkillIds)
    expect(charSkillMap["10001534"].relatedSkills).toEqual(skillIds.slice(1, 4))
  })

  it("共有コードのカードIDとカード色・コストを正しく登録する", () => {
    expect(skillIds.map((id) => skills[id.toString()].cardID)).toEqual(cardIds)
    expect(cards["10600633"]).toMatchObject({ color: "Purple", cost_SN: 20000 })
    expect(cards["10600634"]).toMatchObject({ color: "Red", cost_SN: 20000 })
    expect(cards["10600635"]).toMatchObject({ color: "Purple", cost_SN: 20000 })
    expect(cards["10600636"]).toMatchObject({ color: "Yellow", cost_SN: 20000 })
    expect(cards["10600637"]).toMatchObject({ color: "Yellow", cost_SN: 30000 })
    expect(cards["10600638"]).toMatchObject({
      color: "Purple",
      cost_SN: 60000,
      cardType: "Special",
    })
  })

  it("スキル2の優先度オプションを指定順に登録する", () => {
    const card = cards["10600637"]

    expect(card.ExCondList?.map(({ des }) => des)).toEqual([80608005])
    expect(card.ExCondList?.[0]).toMatchObject({
      condId: 96200031,
      minNum: 0,
      interValNum: 12,
      isNumCond: true,
      typeEnum: "number",
    })
    expect(card.ExActList?.map(({ des }) => des)).toEqual([
      80610277,
      80610278,
      80611607,
      80608012,
    ])
    expect(card.ExActList?.[2]).toMatchObject({
      minNum: 1,
      interValNum: 5,
      isNumCond: true,
      typeEnum: "number",
    })
  })

  it("共鳴5件・覚醒6件・生活スキル3件を登録し、基本突破は属性なしにする", () => {
    const character = characters["10001534"]

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
    expect(breakthroughs["12101563"].attributeList).toEqual([
      { attributeType: "Atk", numType: "Number", num_SN: 150000000 },
      { attributeType: "Def", numType: "Number", num_SN: 150000000 },
      { attributeType: "Hp", numType: "Percent", num_SN: 150000 },
    ])
  })

  it("生活スキルの効果量と種類が正しい", () => {
    expect(homeSkills["83900326"]).toMatchObject({ param: 0.2, homeSkillType: "AddSpecQty" })
    expect(homeSkills["83900327"]).toMatchObject({ param: 5, homeSkillType: "RiseSpaceLimited" })
    expect(homeSkills["83900328"]).toMatchObject({ param: 0.3, homeSkillType: "AddSpecQty" })
  })

  it("キャラクター・スキル・共鳴・覚醒画像を登録する", () => {
    expect(images["char_10001534"]).toBe(
      "https://resonance.wikiru.jp/attach2/E382A2E383AAE382B9_E382A2E383AAE382B95F48616C66312E706E67.png",
    )
    skillIds.forEach((id) => expect(images[`skill_${id}`]).toBeTruthy())
    talentIds.forEach((id) => expect(images[`talent_${id}`]).toBeTruthy())
    breakthroughIds.slice(1).forEach((id) => expect(images[`break_${id}`]).toBeTruthy())
  })

  it.each(locales)("必須メッセージキーが%sに揃っている", (locale) => {
    const messages = JSON.parse(
      readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
    ) as LocaleMessages

    expect(messages.char["10001534"]).toMatchObject({
      name: expect.any(String),
      identity: expect.any(String),
      ability: expect.any(String),
    })
    if (locale === "jp") {
      expect(messages.char["10001534"]).toEqual({
        name: "アリス",
        identity: "？？？",
        ability: "不明",
      })
      expect(messages.skill["12305243"].leaderCardConditionDesc).toBe(
        "クールダウン：36秒。味方がコストを1Pt消費するたび、クールダウン-2秒",
      )
      expect(messages.break["12101560"]).toEqual({ name: "覚醒（基礎）", desc: "基礎突破" })
      expect(messages.talent["12824053"].desc).toBe("HP+35%")
      expect(messages.home_skill["83900327"].desc).toBe("列車カーゴ上限+%s")
    }
    skillIds.forEach((id) => {
      expect(messages.skill[id.toString()]).toMatchObject({
        name: expect.any(String),
        description: expect.any(String),
        detailDescription: expect.any(String),
      })
    })
    cardIds.forEach((id) => expect(messages.card[id.toString()]).toMatchObject({ name: expect.any(String) }))
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
    expect(messages.skill["12305243"].leaderCardConditionDesc).toBeTruthy()
  })
})
