/** @vitest-environment jsdom */
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

// -------------------------------------------------------
// Global mocks
// -------------------------------------------------------

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt?: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="next-image" src={src} alt={alt ?? ""} />
  ),
}))

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string) => key
    t.rich = (key: string) => key
    return t
  },
  useLocale: () => "jp",
}))

// Mock SearchModal to render children directly
vi.mock("@/components/ui/modal/SearchModal", () => ({
  SearchModal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock inner modals as null (not tested here)
vi.mock("@/components/character-details-modal", () => ({
  CharacterDetailsModal: () => null,
}))

vi.mock("@/components/equipment-details-modal", () => ({
  EquipmentDetailsModal: () => null,
}))

// -------------------------------------------------------
// Fixtures
// -------------------------------------------------------

const baseCharacter = {
  id: 1,
  name: "char.name",
  img_card: "https://patchwiki.biligame.com/images/resonance/char.png",
  rarity: "SSR",
  desc: "char.desc",
  hp_SN: 0,
  atk_SN: 0,
  def_SN: 0,
  skillList: [{ skillId: 123, num: 1 }],
  talentList: [{ talentId: 456, resonanceLv: 1 }],
  breakthroughList: [{ breakthroughId: 0 }, { breakthroughId: 789 }],
}

const baseEquipment = {
  id: "equip-1",
  name: "equip.name",
  url: "https://patchwiki.biligame.com/images/resonance/equip.png",
  quality: "Orange",
  type: "weapon",
  effect: "",
  skillList: [],
}

// -------------------------------------------------------
// 7. CharacterSearchModal
// -------------------------------------------------------
describe("CharacterSearchModal – uses next/image", () => {
  it("renders Image component for character thumbnail", async () => {
    const { CharacterSearchModal } = await import("@/components/ui/modal/CharacterSearchModal")
    render(
      <CharacterSearchModal
        isOpen={true}
        onClose={() => {}}
        title="Select Character"
        characters={[baseCharacter as any]}
        onSelectCharacter={() => {}}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 8. EquipmentSearchModal
// -------------------------------------------------------
describe("EquipmentSearchModal – uses next/image", () => {
  it("renders Image component for equipment thumbnail", async () => {
    const { EquipmentSearchModal } = await import("@/components/ui/modal/EquipmentSearchModal")
    render(
      <EquipmentSearchModal
        isOpen={true}
        onClose={() => {}}
        title="Select Equipment"
        equipments={[baseEquipment as any]}
        onSelectEquipment={() => {}}
        type="weapon"
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})
