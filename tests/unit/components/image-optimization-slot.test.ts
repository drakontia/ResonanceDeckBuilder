import { readFileSync } from "fs"
import { join } from "path"
import { describe, expect, it } from "vitest"

const read = (relativePath: string) => readFileSync(join(process.cwd(), relativePath), "utf-8")

describe("slot related image optimization", () => {
  it("uses optimized image components in CharacterSlot", () => {
    const content = read("components/character-slot.tsx")
    expect(content).toMatch(/from "next\/image"/)
    expect(content).toMatch(/SafeImage/)
    expect(content).not.toMatch(/<img[\s>]/)
  })

  it("uses next/image in DeckBuilder", () => {
    const content = read("components/deckBuilder.tsx")
    expect(content).toMatch(/from "next\/image"/)
    expect(content).not.toMatch(/<img[\s>]/)
  })
})
