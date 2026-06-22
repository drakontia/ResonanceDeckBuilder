import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #88: ティスタル 青翠の羽 優先度オプション", () => {
  it("カード10600529の優先度オプションを指定順で保持する", () => {
    const targetCard = cards["10600529"]
    expect(targetCard).toBeDefined()

    const actionOptions = targetCard.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80610277, 80610278, 80608012, 80611608, 80611607])

    const numberOption = actionOptions.at(-1)
    expect(numberOption).toEqual(
      expect.objectContaining({
        des: 80611607,
        isNumCond: true,
        minNum: 1,
        interValNum: 5,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })
})
