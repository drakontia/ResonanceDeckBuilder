import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #101: 美琪 信号上書きに枚数指定の追加", () => {
  it("カード10600571の優先度オプションが手札数条件のみで、0〜11になる", () => {
    const targetCard = cards["10600571"]
    expect(targetCard).toBeDefined()

    const actionOptions = targetCard.ExActList ?? []
    expect(actionOptions.map((item) => item.des)).toEqual([80608005])

    const handCountOption = actionOptions.at(-1)
    expect(handCountOption).toEqual(
      expect.objectContaining({
        des: 80608005,
        isNumCond: true,
        minNum: 0,
        interValNum: 12,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })
})
