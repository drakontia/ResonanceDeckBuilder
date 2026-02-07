/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { Preset } from "../../../types"
import {
  deleteDeck,
  getCurrentDeck,
  getCurrentDeckId,
  getSavedDeckById,
  getSavedDecks,
  removeCurrentDeckId,
  saveDeck,
} from "../../../utils/local-storage"

const basePreset: Preset = {
  roleList: [],
  header: 0,
  cardList: [],
  isLeaderCardOn: false,
  isSpCardOn: false,
  keepCardNum: 0,
  discardType: 0,
  otherCard: 0,
}

describe("local-storage utils", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("saves and loads decks", () => {
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(123456)

    const saved = saveDeck("Test Deck", basePreset)

    expect(saved.id).toContain("deck_123456_")
    expect(getSavedDecks()).toHaveLength(1)
    expect(getSavedDeckById(saved.id)?.name).toBe("Test Deck")
    expect(getCurrentDeckId()).toBe(saved.id)

    nowSpy.mockRestore()
  })

  it("updates an existing deck", () => {
    const first = saveDeck("First", basePreset, "deck_fixed")
    const updated = saveDeck("Updated", basePreset, first.id)

    expect(updated.id).toBe("deck_fixed")
    expect(updated.name).toBe("Updated")
    expect(getSavedDecks()).toHaveLength(1)
  })

  it("deletes a deck and clears current id", () => {
    const saved = saveDeck("Delete Me", basePreset)

    expect(deleteDeck(saved.id)).toBe(true)
    expect(getSavedDecks()).toHaveLength(0)
    expect(getCurrentDeckId()).toBeNull()
  })

  it("returns false when deleting missing deck", () => {
    expect(deleteDeck("missing")).toBe(false)
  })

  it("returns current deck when set", () => {
    const saved = saveDeck("Current", basePreset)

    expect(getCurrentDeck()?.id).toBe(saved.id)
  })

  it("returns empty list when storage is invalid", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    localStorage.setItem("resonance_saved_decks", "{")

    expect(getSavedDecks()).toEqual([])

    consoleSpy.mockRestore()
  })

  it("removes current deck id", () => {
    const saved = saveDeck("Remove", basePreset)

    expect(getCurrentDeckId()).toBe(saved.id)
    removeCurrentDeckId()
    expect(getCurrentDeckId()).toBeNull()
  })
})
