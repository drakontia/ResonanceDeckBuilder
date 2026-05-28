import { readFileSync } from "fs"
import { join } from "path"
import { describe, expect, it } from "vitest"

const root = process.cwd()

const read = (relativePath: string) => readFileSync(join(root, relativePath), "utf-8")

describe("image optimization migration", () => {
  it("keeps shared SafeImage component based on next/image", () => {
    const safeImage = read("components/ui/SafeImage.tsx")
    expect(safeImage).toMatch(/from "next\/image"/)
    expect(safeImage).toMatch(/export function SafeImage/)
  })

  it("uses SafeImage in detail components", () => {
    const targets = [
      "components/card-settings/CardInfo.tsx",
      "components/character-details/CharacterInfo.tsx",
      "components/character-details/BreakthroughsList.tsx",
      "components/character-details/TalentsList.tsx",
      "components/equipment-details-modal.tsx",
      "components/character-details-modal.tsx",
      "components/skill-card.tsx",
    ]

    for (const file of targets) {
      const content = read(file)
      expect(content).toMatch(/from "next\/image"|SafeImage/)
      expect(content).not.toMatch(/<img[\s>]/)
    }
  })
})
