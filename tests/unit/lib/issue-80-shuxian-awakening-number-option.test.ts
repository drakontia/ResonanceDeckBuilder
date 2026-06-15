import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #80: 陳書閑 目覚めの単叢 ナンバー指定", () => {
  it("カード10600523の優先度オプション末尾にナンバー指定を追加する", () => {
    const targetCard = cards["10600523"]
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
