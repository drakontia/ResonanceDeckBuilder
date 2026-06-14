import { describe, expect, it } from "vitest"

describe("Issue #74: ドラミス共生オプション順", () => {
  it("カード10600510のナンバー指定オプションが末尾にある", async () => {
    const { cards } = await import("@/lib/cardDb")
    const targetCard = cards["10600510"]

    expect(targetCard).toBeDefined()

    const actionOptions = (targetCard.ExActList ?? []).map((item) => item.des)
    expect(actionOptions).toEqual([80610277, 80610278, 80611604, 80611605, 80611603])
    expect(actionOptions.at(-1)).toBe(80611603)
  })
})
