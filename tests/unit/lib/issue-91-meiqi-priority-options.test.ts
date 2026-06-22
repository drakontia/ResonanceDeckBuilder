import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #91: 美琪 秘話専線 優先度オプション", () => {
  it("カード10600573の優先度オプションに3項目を追加する", () => {
    const targetCard = cards["10600573"]
    expect(targetCard).toBeDefined()

    const actionOptions = targetCard.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80610277, 80610278, 80611607])

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
