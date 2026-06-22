import { describe, expect, it } from "vitest"

import { images } from "@/lib/imgDb"

describe("Issue #92: 美琪 協同射撃の画像マッピング", () => {
  it("skill_12304492 が imgDb に登録されている", () => {
    expect(images["skill_12304492"]).toBeDefined()
  })
})
