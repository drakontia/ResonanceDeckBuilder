import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #97: 美琪 信号上書き 手札数優先度オプション", () => {
  it("カード10600571に手札数条件を追加する", () => {
    const targetCard = cards["10600571"]
    expect(targetCard).toBeDefined()
    expect(targetCard.name).toBe("card.10600571.name")

    // Check that ExActList exists and contains the hand count condition
    const actionOptions = targetCard.ExActList ?? []
    expect(actionOptions.length).toBeGreaterThan(0)

    // Verify the hand count condition is in the ExActList
    const handCountOption = actionOptions.find((item) => item.des === 80608005)
    expect(handCountOption).toBeDefined()

    // Check the hand count condition properties
    expect(handCountOption).toEqual(
      expect.objectContaining({
        des: 80608005, // text_80608005 = "手札数≤"
        isNumCond: true,
        minNum: 10,
        interValNum: 2,
        numDuration: 1,
        typeEnum: "number",
      }),
    )
  })
})
