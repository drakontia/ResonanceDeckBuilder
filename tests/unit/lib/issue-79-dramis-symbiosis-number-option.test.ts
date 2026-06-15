import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #79: ドラミス共生 ナンバー指定", () => {
  it("カード10600510の優先度オプション末尾にナンバー指定を設定する", () => {
    const targetCard = cards["10600510"]
    expect(targetCard).toBeDefined()

    const actionOptions = targetCard.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80610277, 80610278, 80611604, 80611605, 80611603])

    const numberOption = actionOptions.at(-1)
    expect(numberOption).toEqual(
      expect.objectContaining({
        des: 80611603,
        isNumCond: true,
        minNum: 1,
        interValNum: 5,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })
})
