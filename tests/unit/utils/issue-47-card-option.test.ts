import { describe, expect, it } from "vitest"

import cards from "@/lib/cardDb"
import cnMessages from "@/messages/cn.json"
import enMessages from "@/messages/en.json"
import jpMessages from "@/messages/jp.json"
import koMessages from "@/messages/ko.json"
import twMessages from "@/messages/tw.json"

describe("issue #47 card option", () => {
  it("adds a toggle option for card 10600544 when Radiance is 50+", () => {
    const targetCard = cards["10600544"]
    expect(targetCard).toBeDefined()
    expect(targetCard.ExCondList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          des: 80611606,
          isNumCond: false,
        }),
      ]),
    )
  })

  it("provides message text for the new option in all locales", () => {
    expect(jpMessages.text_80611606).toBe("【輝光】ポイントが50以上の時に発動")
    expect(enMessages.text_80611606).toBe("Activates when [Radiance] points are 50 or higher")
    expect(koMessages.text_80611606).toBe("【휘광】 포인트가 50 이상일 때 발동")
    expect(cnMessages.text_80611606).toBe("【辉光】点数达到50以上时发动")
    expect(twMessages.text_80611606).toBe("【輝光】點數達到50以上時發動")
  })

  it("renames the Japanese card title to 不滅の一撃", () => {
    expect(jpMessages.skill["12304472"].name).toBe("不滅の一撃")
    expect(jpMessages.card["10600544"].name).toBe("不滅の一撃")
  })
})
