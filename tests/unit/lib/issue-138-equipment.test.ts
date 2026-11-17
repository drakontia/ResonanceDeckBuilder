import { describe, expect, it } from "vitest"

import { equipments } from "@/lib/equipDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"
import cn from "@/messages/cn.json"
import en from "@/messages/en.json"
import jp from "@/messages/jp.json"
import ko from "@/messages/ko.json"
import tw from "@/messages/tw.json"

const equipmentId = "11800403"
const skillId = "12305057"
const imageUrl =
  "https://resonance.wikiru.jp/attach2/696D67_E6BC86E9BB92E381AEE588835F742E706E67.png"

describe("Issue #138 equipment data", () => {
  it("漆黒の刃がUR武器として装備データに追加されている", () => {
    const equipment = equipments[equipmentId]

    expect(equipment).toMatchObject({
      id: 11800403,
      name: "equip.11800403.name",
      des: "equip.11800403.des",
      equipTagId: 12600155,
      quality: "Orange",
      skillList: [{ skillId: 12305057 }],
      Getway: [
        {
          DisplayName: "equip.11800403.getway.0.displayName",
          FromLevel: -1,
          UIName: "",
          Way3: "",
          funcId: 4294967295,
        },
      ],
    })
  })

  it("直接表示できる武器画像とパッシブスキルが登録されている", () => {
    expect(images[`equip_${equipmentId}`]).toBe(imageUrl)
    expect(skills[skillId]).toMatchObject({
      id: 12305057,
      name: "skill.12305057.name",
      mod: "被動技能",
      description: "skill.12305057.description",
      cardID: null,
    })
  })

  it("5言語の名前・説明・入手方法・効果が揃っている", () => {
    const locales = [
      [jp, "漆黒の刃", "味方全体が与える暗黒ダメージ+20%。デッキ内のカード1枚につき、さらに+3%", "コラボ限定イベント「箱庭の内と外」-図書返却所"],
      [en, "Black Blade", "Increases Dark DMG dealt by all allies by 20%. For each card in the deck, increases it by an additional 3%.", 'Limited-time collaboration event "Inside and Outside the Miniature Garden" - Book Return Desk'],
      [ko, "칠흑의 칼날", "아군 전체가 주는 암흑 피해가 20% 증가한다. 덱에 있는 카드 1장당 추가로 3% 증가한다.", "콜라보 한정 이벤트 「정원 안과 밖」-도서 반납소"],
      [cn, "漆黑之刃", "全体友方造成的暗黑伤害提升20%。牌组中每有1张卡牌，额外提升3%。", "联动限定活动「庭园之内与之外」-图书归还处"],
      [tw, "漆黑之刃", "全體友方造成的暗黑傷害提升20%。牌組中每有1張卡牌，額外提升3%。", "聯動限定活動「箱庭之內與之外」-圖書歸還處"],
    ] as const

    for (const [messages, name, effect, getway] of locales) {
      expect(messages.equip[equipmentId]).toMatchObject({
        name,
        des: "",
        getway: { "0": { displayName: getway } },
      })
      expect(messages.skill[skillId]).toMatchObject({
        name,
        description: effect,
      })
    }
  })
})
