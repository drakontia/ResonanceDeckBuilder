"use client"

import { useCallback, useMemo, useState } from "react"
import type { Character } from "../../types"

type SortBy = "name" | "rarity"
type SortDirection = "asc" | "desc"

interface UseCharacterWindowParams {
  selectedCharacters: number[]
  availableCharacters: Character[]
  onAddCharacter: (characterId: number, slot: number) => void
  onRemoveCharacter: (slot: number) => void
  t: (key: string) => string
}

export function useCharacterWindow({
  selectedCharacters,
  availableCharacters,
  onAddCharacter,
  onRemoveCharacter,
  t,
}: UseCharacterWindowParams) {
  const [showSelector, setShowSelector] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number>(-1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("rarity")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [slotHasExistingCharacter, setSlotHasExistingCharacter] = useState(false)

  const handleOpenSelector = useCallback(
    (slot: number) => {
      const hasExistingCharacter = selectedCharacters[slot] !== -1
      setSlotHasExistingCharacter(hasExistingCharacter)
      setSelectedSlot(slot)
      setSearchTerm("")
      setShowSelector(true)
    },
    [selectedCharacters],
  )

  const handleCloseSelector = useCallback(() => {
    setShowSelector(false)
    setSelectedSlot(-1)
    setSlotHasExistingCharacter(false)
  }, [])

  const handleCharacterSelect = useCallback(
    (characterId: number) => {
      if (selectedSlot === -1) return

      if (slotHasExistingCharacter) {
        onRemoveCharacter(selectedSlot)
      }

      if (characterId !== -1) {
        onAddCharacter(characterId, selectedSlot)
      }

      handleCloseSelector()
    },
    [selectedSlot, slotHasExistingCharacter, onRemoveCharacter, onAddCharacter, handleCloseSelector],
  )

  const handleSearchChange = useCallback((value: string) => setSearchTerm(value), [])
  const handleSortByChange = useCallback((value: SortBy) => setSortBy(value), [])
  const handleSortDirectionToggle = useCallback(() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc")), [])

  const availableForSelection = useMemo(
    () => availableCharacters.filter((character) => !selectedCharacters.includes(character.id)),
    [availableCharacters, selectedCharacters],
  )

  const filteredCharacters = useMemo(
    () =>
      availableForSelection.filter((character) => t(character.name).toLowerCase().includes(searchTerm.toLowerCase())),
    [availableForSelection, searchTerm, t],
  )

  const sortedCharacters = useMemo(() => {
    const rarityOrder = { UR: 4, SSR: 3, SR: 2, R: 1 } as const
    const result = [...filteredCharacters].sort((a, b) => {
      if (sortBy === "name") {
        return t(a.name).localeCompare(t(b.name))
      }

      return (
        (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) -
        (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0)
      )
    })

    return sortDirection === "asc" ? result.reverse() : result
  }, [filteredCharacters, sortBy, sortDirection, t])

  const hasAnyCharacter = useMemo(() => selectedCharacters.some((id) => id !== -1), [selectedCharacters])

  return {
    showSelector,
    selectedSlot,
    searchTerm,
    sortBy,
    sortDirection,
    sortedCharacters,
    hasAnyCharacter,
    handleOpenSelector,
    handleCloseSelector,
    handleCharacterSelect,
    handleSearchChange,
    handleSortByChange,
    handleSortDirectionToggle,
  }
}
