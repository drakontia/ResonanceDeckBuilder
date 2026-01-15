"use client"

import type { Character, Card, Equipment } from "../types"
import { CharacterSlot } from "./character-slot"
import { CharacterSearchModal } from "./ui/modal/CharacterSearchModal"
import { useTranslations } from "next-intl"
import { useCharacterWindow } from "../hooks/deck-builder/useCharacterWindow"

interface CharacterWindowProps {
  selectedCharacters: number[]
  leaderCharacter: number
  onAddCharacter: (characterId: number, slot: number) => void
  onRemoveCharacter: (slot: number) => void
  onSetLeader: (characterId: number) => void
  getCharacter: (id: number) => Character | null
  availableCharacters: Character[]
  equipment: Array<{
    weapon: string | null
    armor: string | null
    accessory: string | null
  }>
  onEquipItem: (slotIndex: number, equipType: "weapon" | "armor" | "accessory", equipId: string | null) => void
  getCardInfo: (cardId: string) => { card: Card } | null
  getEquipment: (equipId: string) => Equipment | null
  equipments?: Equipment[]
  data: any
  getSkill?: (skillId: number) => any
  awakening?: Record<number, number> // 각성 정보 추가
  onAwakeningSelect?: (characterId: number, stage: number | null) => void // 각성 선택 콜백 추가
}

export function CharacterWindow({
  selectedCharacters,
  leaderCharacter,
  onAddCharacter,
  onRemoveCharacter,
  onSetLeader,
  getCharacter,
  availableCharacters,
  equipment,
  onEquipItem,
  getCardInfo,
  getEquipment,
  equipments = [],
  data,
  getSkill,
  awakening = {},
  onAwakeningSelect,
}: CharacterWindowProps) {
  const t = useTranslations()
  const {
    showSelector,
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
  } = useCharacterWindow({
    selectedCharacters,
    availableCharacters,
    onAddCharacter,
    onRemoveCharacter,
    t,
  })

  return (
    <div className="w-full">
      {/* 항상 5개의 캐릭터 슬롯이 한 줄에 표시되도록 수정 */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-4">
        {selectedCharacters.map((characterId, index) => (
          <CharacterSlot
            key={index}
            index={index}
            characterId={characterId}
            onAddCharacter={() => handleOpenSelector(index)}
            onRemoveCharacter={() => onRemoveCharacter(index)}
            character={getCharacter(characterId)}
            equipment={equipment[index]}
            onEquipItem={onEquipItem}
            isLeader={characterId === leaderCharacter}
            onSetLeader={() => onSetLeader(characterId)}
            getCardInfo={getCardInfo}
            getEquipment={getEquipment}
            equipments={equipments}
            data={data}
            getSkill={getSkill}
            hasAnyCharacter={hasAnyCharacter}
            awakeningStage={characterId !== -1 ? awakening[characterId] || null : null}
            onAwakeningSelect={onAwakeningSelect}
          />
        ))}
      </div>

      {/* 새로운 캐릭터 검색 모달 컴포넌트 사용 */}
      <CharacterSearchModal
        isOpen={showSelector}
        onClose={handleCloseSelector}
        title={
          <h3 className="text-lg font-bold neon-text">
            {t("select_character") || "Select Character"}
          </h3>
        }
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortByChange={(value) => handleSortByChange(value as "name" | "rarity")}
        sortDirection={sortDirection}
        onSortDirectionChange={handleSortDirectionToggle}
        sortOptions={[
          { value: "rarity", label: t("sort_by_rarity") || "Sort by Rarity" },
          { value: "name", label: t("sort_by_name") || "Sort by Name" },
        ]}
        searchPlaceholder={t("search_characters") || "Search characters"}
        characters={sortedCharacters}
        onSelectCharacter={handleCharacterSelect}
        getCardInfo={getCardInfo}
        getSkill={getSkill}
        data={data}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex justify-end">
            <button onClick={handleCloseSelector} className="neon-button px-4 py-2 rounded-lg text-sm">
              {t("close") || "Close"}
            </button>
          </div>
        }
      />
    </div>
  )
}
