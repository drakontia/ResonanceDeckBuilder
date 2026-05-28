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

// Mock CharacterSlot's modal dependencies
vi.mock("@/components/character-details-modal", () => ({
  CharacterDetailsModal: () => null,
}))

vi.mock("@/components/equipment-details-modal", () => ({
  EquipmentDetailsModal: () => null,
}))

vi.mock("@/components/ui/modal/EquipmentSearchModal", () => ({
  EquipmentSearchModal: () => null,
}))

vi.mock("@/hooks/deck-builder/useCharacterSlot", () => ({
  useCharacterSlot: () => ({
    showEquipmentSelector: null,
    setShowEquipmentSelector: vi.fn(),
    showCharacterDetails: false,
    setShowCharacterDetails: vi.fn(),
    showEquipmentDetails: null,
    setShowEquipmentDetails: vi.fn(),
    characterSlotRef: { current: null },
    characterSlotStyle: {},
    buttonSize: 24,
    crownSize: 32,
    getRarityColor: () => "border-yellow-500",
    getEquipmentSlotClass: () => "equipment-slot",
    handleEquipmentClick: vi.fn(),
    handleOpenCharacterDetails: vi.fn(),
  }),
}))

// DeckBuilder mocks
vi.mock("@/hooks/deck-builder/useDeckBuilderPage", () => ({
  useDeckBuilderPage: () => ({
    ToastContainer: () => null,
    contentRef: { current: null },
    data: { cards: {}, images: {}, talents: {}, breakthroughs: {} },
    loading: false,
    error: null,
    isLocalLoading: false,
    availableCards: [],
    selectedCharacters: [-1, -1, -1, -1, -1],
    leaderCharacter: -1,
    selectedCards: [],
    battleSettings: {},
    equipment: [{}, {}, {}, {}, {}],
    awakening: [{}, {}, {}, {}, {}],
    getCharacter: () => null,
    getCardInfo: () => null,
    getEquipment: () => null,
    getSkill: () => null,
    allEquipments: [],
    addCharacter: vi.fn(),
    removeCharacter: vi.fn(),
    setLeader: vi.fn(),
    addCard: vi.fn(),
    removeCard: vi.fn(),
    reorderCards: vi.fn(),
    updateCardSettings: vi.fn(),
    updateBattleSettings: vi.fn(),
    updateEquipment: vi.fn(),
    handleAwakeningSelect: vi.fn(),
    handleImport: vi.fn(),
    handleExport: vi.fn(),
    handleScreenshotError: vi.fn(),
    handleShare: vi.fn(),
    handleClear: vi.fn(),
    handleOpenSaveModal: vi.fn(),
    handleOpenLoadModal: vi.fn(),
    handleCloseSaveModal: vi.fn(),
    handleCloseLoadModal: vi.fn(),
    showSaveModal: false,
    showLoadModal: false,
    handleSaveSuccess: vi.fn(),
    handleLoadSuccess: vi.fn(),
    handleLoadDeck: vi.fn(),
    handleDeleteDeck: vi.fn(),
    handleShareSavedDeck: vi.fn(),
    getCharacterName: () => "",
    handleSortCharacters: vi.fn(),
    createPresetObject: () => ({}),
  }),
}))

vi.mock("@/components/top-bar", () => ({ TopBar: () => <div data-testid="top-bar" /> }))
vi.mock("@/components/character-window", () => ({ CharacterWindow: () => <div data-testid="character-window" /> }))
vi.mock("@/components/skill-window", () => ({ SkillWindow: () => <div data-testid="skill-window" /> }))
vi.mock("@/components/battle-settings", () => ({ BattleSettings: () => <div data-testid="battle-settings" /> }))
vi.mock("@/components/comments-section", () => ({ CommentsSection: () => <div data-testid="comments-section" /> }))
vi.mock("@/components/loading-screen", () => ({ LoadingScreen: () => <div data-testid="loading-screen" /> }))
vi.mock("@/components/ui/modal/SaveDeckModal", () => ({ SaveDeckModal: () => null }))
vi.mock("@/components/ui/modal/LoadDeckModal", () => ({ LoadDeckModal: () => null }))

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
// 10. CharacterSlot
// -------------------------------------------------------
describe("CharacterSlot – uses next/image", () => {
  it("renders Image component for character card image", async () => {
    const { CharacterSlot } = await import("@/components/character-slot")
    render(
      <CharacterSlot
        index={0}
        characterId={1}
        character={baseCharacter as any}
        onAddCharacter={() => {}}
        onRemoveCharacter={() => {}}
        equipment={{ weapon: null, armor: null, accessory: null }}
        onEquipItem={() => {}}
        isLeader={false}
        onSetLeader={() => {}}
        getCardInfo={() => null}
        getEquipment={() => null}
        data={{}}
        hasAnyCharacter={true}
      />,
    )
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })

  it("renders Image component for equipment slot image", async () => {
    const { CharacterSlot } = await import("@/components/character-slot")
    render(
      <CharacterSlot
        index={0}
        characterId={1}
        character={baseCharacter as any}
        onAddCharacter={() => {}}
        onRemoveCharacter={() => {}}
        equipment={{ weapon: "equip-1", armor: null, accessory: null }}
        onEquipItem={() => {}}
        isLeader={false}
        onSetLeader={() => {}}
        getCardInfo={() => null}
        getEquipment={(id) => (id === "equip-1" ? (baseEquipment as any) : null)}
        data={{}}
        hasAnyCharacter={true}
      />,
    )
    // character image + weapon equipment image
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(2)
  })
})

// -------------------------------------------------------
// 11. DeckBuilder (GitHub icon)
// -------------------------------------------------------
describe("DeckBuilder – uses next/image", () => {
  it("renders Image component for GitHub icon", async () => {
    const DeckBuilder = (await import("@/components/deckBuilder")).default
    render(<DeckBuilder urlDeckCode={null} />)
    expect(screen.getAllByTestId("next-image").length).toBeGreaterThanOrEqual(1)
  })
})
