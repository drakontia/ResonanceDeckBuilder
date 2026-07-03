import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

type Messages = {
  skill: Record<string, { name?: string }>
  card: Record<string, { name?: string }>
}

function readJapaneseMessages(): Messages {
  const path = resolve(process.cwd(), "messages", "jp.json")
  return JSON.parse(readFileSync(path, "utf-8")) as Messages
}

describe("Issue #102: シャナのスキル名差し違い", () => {
  it("断罪と天破壌砕の名称対応を正しく保持する", () => {
    const jp = readJapaneseMessages()

    expect(jp.skill["12304514"]?.name).toBe("断罪")
    expect(jp.skill["12304515"]?.name).toBe("天破壌砕")
    expect(jp.card["10600550"]?.name).toBe("天破壌砕")
    expect(jp.card["10600551"]?.name).toBe("断罪")
  })
})
