import { describe, expect, it } from "vitest"

// Issue #75: カルのスキル1【羽休み】のコストを3→2に修正
// カードID: 10600518, スキルID: 12303991
// cost_SN は実際のコスト * 10000 で格納される（例: 30000 = コスト3, 20000 = コスト2）

describe("Issue #75: カルのスキル1【羽休み】コスト修正", () => {
  it("【羽休み】(カードID: 10600518) のコストが2である", async () => {
    const { cards } = await import("@/lib/cardDb")
    const card = cards["10600518"]

    expect(card).toBeDefined()
    expect(card.id).toBe(10600518)
    expect(card.cost_SN).toBe(20000) // コスト2 = 20000 (2 * 10000)
  })
})
