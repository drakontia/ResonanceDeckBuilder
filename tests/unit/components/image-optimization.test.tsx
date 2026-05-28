/** @vitest-environment jsdom */
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

// -------------------------------------------------------
// Global mocks (hoisted so vi.mock factory can reference)
// -------------------------------------------------------

vi.mock("next/image", () => ({
  default: ({ src, alt, fill, ...rest }: { src: string; alt?: string; fill?: boolean; [key: string]: unknown }) => (
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

// -------------------------------------------------------
// Minimal character fixture
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
  breakthroughList: [
    { breakthroughId: 0 },
    { breakthroughId: 789 },
  ],
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
// 1. CharacterInfo
// -------------------------------------------------------
describe("CharacterInfo – uses next/image", () => {
  it("renders Image component for character card", async () => {
    const { CharacterInfo } = await import("@/components/character-details/CharacterInfo")
    render(
      <CharacterInfo
        character={baseCharacter as any}
        getRarityColor={() => "bg-yellow-500"}
        renderSkill={() => <div />}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 2. BreakthroughsList
// -------------------------------------------------------
describe("BreakthroughsList – uses next/image", () => {
  it("renders Image component for breakthrough image", async () => {
    const { BreakthroughsList } = await import("@/components/character-details/BreakthroughsList")
    render(
      <BreakthroughsList
        character={baseCharacter as any}
        data={{}}
        selectedAwakeningStage={null}
        getImageUrl={() => "https://patchwiki.biligame.com/images/resonance/break.png"}
        onAwakeningSelect={() => {}}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 3. TalentsList
// -------------------------------------------------------
describe("TalentsList – uses next/image", () => {
  it("renders Image component for talent image", async () => {
    const { TalentsList } = await import("@/components/character-details/TalentsList")
    render(
      <TalentsList
        character={baseCharacter as any}
        homeSkills={[]}
        data={{}}
        getImageUrl={() => "https://patchwiki.biligame.com/images/resonance/talent.png"}
        processHomeSkillDesc={(desc) => desc}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 4. CardInfo
// -------------------------------------------------------
vi.mock("@/utils/skill-description", () => ({
  processSkillDescription: (_obj: unknown, desc: string) => desc,
}))

describe("CardInfo – uses next/image", () => {
  it("renders Image component for card image", async () => {
    const { CardInfo } = await import("@/components/card-settings/CardInfo")
    const card = { id: "c1", name: "card.name" } as any
    const extraInfo = {
      name: "card.name",
      img_url: "https://patchwiki.biligame.com/images/resonance/card.png",
      cost: 3,
      amount: 0,
      desc: "card.desc",
    } as any
    render(<CardInfo card={card} extraInfo={extraInfo} />)
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 5. EquipmentDetailsModal
// -------------------------------------------------------
vi.mock("@/components/ui/modal/Modal", () => ({
  Modal: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}))

describe("EquipmentDetailsModal – uses next/image", () => {
  it("renders Image component for equipment image", async () => {
    const { EquipmentDetailsModal } = await import("@/components/equipment-details-modal")
    render(
      <EquipmentDetailsModal
        isOpen={true}
        onClose={() => {}}
        equipment={baseEquipment as any}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 6. CharacterDetailsModal – skill image
// -------------------------------------------------------
vi.mock("@/components/ui/modal/TabModal", () => ({
  TabModal: ({ tabs }: { tabs: { id: string; content: React.ReactNode }[] }) => (
    <div>
      {tabs.map((tab) => (
        <div key={tab.id}>{tab.content}</div>
      ))}
    </div>
  ),
}))

vi.mock("@/lib/homeSkillDb", () => ({
  getHomeSkillsForCharacter: () => [],
}))

describe("CharacterDetailsModal – uses next/image", () => {
  it("renders Image component for skill image", async () => {
    const { CharacterDetailsModal } = await import("@/components/character-details-modal")
    const data = {
      images: { skill_123: "https://patchwiki.biligame.com/images/resonance/skill.png" },
    }
    const getSkill = () => ({ id: 123, name: "skill.name", desc: "skill.desc", params: [] })
    render(
      <CharacterDetailsModal
        isOpen={true}
        onClose={() => {}}
        character={baseCharacter as any}
        data={data}
        getSkill={getSkill}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})

// -------------------------------------------------------
// 9. SkillCard
// -------------------------------------------------------
vi.mock("@/lib/charSkillMap", () => ({
  charSkillMap: {},
}))

describe("SkillCard – uses next/image", () => {
  it("renders Image component for character background", async () => {
    const { SkillCard } = await import("@/components/skill-card")
    const card = { id: "s1", name: "skill.card.name" } as any
    const extraInfo = {
      name: "skill.card.name",
      img_url: null,
      cost: 1,
      amount: 0,
      desc: "skill.card.desc",
    } as any
    render(
      <SkillCard
        card={card}
        extraInfo={extraInfo}
        characterImage="https://patchwiki.biligame.com/images/resonance/char.png"
        onEdit={() => {}}
        isSelected={false}
        selectionLabel=""
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})
