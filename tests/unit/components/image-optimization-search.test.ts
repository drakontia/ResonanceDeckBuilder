import { readFileSync } from "fs"
import { join } from "path"
import { describe, expect, it } from "vitest"

const read = (relativePath: string) => readFileSync(join(process.cwd(), relativePath), "utf-8")

describe("search modal image optimization", () => {
  it("uses next/image in CharacterSearchModal", () => {
    const content = read("components/ui/modal/CharacterSearchModal.tsx")
    expect(content).toMatch(/from "next\/image"/)
    expect(content).not.toMatch(/<img[\s>]/)
  })

  it("uses SafeImage in EquipmentSearchModal", () => {
    const content = read("components/ui/modal/EquipmentSearchModal.tsx")
    expect(content).toMatch(/SafeImage/)
    expect(content).not.toMatch(/<img[\s>]/)
  })
})
