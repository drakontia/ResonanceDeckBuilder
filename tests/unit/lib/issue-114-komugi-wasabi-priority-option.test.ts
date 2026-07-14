import { describe, expect, it } from "vitest"

import { cards } from "@/lib/cardDb"

describe("Issue #114: 小麦 山葵骨棒！ 優先度オプション", () => {
  it("カード10600462に低HP味方ターゲットの優先度オプションを追加する", () => {
    const targetCard = cards["10600462"]
    expect(targetCard).toBeDefined()

    // UI上の順序は固定2項目（直接出す/使用禁止）の後に ExCondList -> ExActList の順で構成される
    expect((targetCard.ExCondList ?? []).map((item) => item.des)).toEqual([80608008])
    expect((targetCard.ExActList ?? []).map((item) => item.des)).toEqual([80608013])
  })
})
