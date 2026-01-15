"use client"

import { Plus, Info, Crown, Sword, Shield, Gem, Star } from "lucide-react"
import type { Character, Card, Equipment } from "../types"
import { EquipmentSearchModal } from "./ui/modal/EquipmentSearchModal"
import { CharacterDetailsModal } from "./character-details-modal"
import { EquipmentDetailsModal } from "./equipment-details-modal"
import { useTranslations } from "next-intl"
import { useCharacterSlot } from "@/hooks/deck-builder/useCharacterSlot"

interface CharacterSlotProps {
  index: number
  characterId: number
  onAddCharacter: () => void
  onRemoveCharacter: () => void
  character: Character | null
  equipment: {
    weapon: string | null
    armor: string | null
    accessory: string | null
  }
  onEquipItem: (slotIndex: number, equipType: "weapon" | "armor" | "accessory", equipId: string | null) => void
  isLeader: boolean
  onSetLeader: () => void
  getCardInfo: (cardId: string) => { card: Card } | null
  getSkill?: (skillId: number) => any
  getEquipment: (equipId: string) => Equipment | null
  equipments?: Equipment[]
  data: any
  hasAnyCharacter: boolean
  awakeningStage?: number | null // 각성 단계 추가
  onAwakeningSelect?: (characterId: number, stage: number | null) => void // 각성 선택 콜백 추가
}

export function CharacterSlot({
  index,
  characterId,
  onAddCharacter,
  onRemoveCharacter,
  character,
  equipment,
  onEquipItem,
  isLeader,
  onSetLeader,
  getCardInfo,
  getSkill,
  getEquipment,
  equipments = [],
  data,
  hasAnyCharacter,
  awakeningStage = null,
  onAwakeningSelect,
}: CharacterSlotProps) {
  const isEmpty = characterId === -1
  const t = useTranslations()

  // Use custom hook for all business logic
  const {
    showEquipmentSelector,
    setShowEquipmentSelector,
    showCharacterDetails,
    setShowCharacterDetails,
    showEquipmentDetails,
    setShowEquipmentDetails,
    characterSlotRef,
    characterSlotStyle,
    buttonSize,
    crownSize,
    getRarityColor,
    getEquipmentSlotClass,
    handleEquipmentClick,
    handleOpenCharacterDetails,
  } = useCharacterSlot({ isEmpty, character })

  const handleEquipItem = (equipId: string | null) => {
    if (showEquipmentSelector && !isEmpty) {
      onEquipItem(index, showEquipmentSelector, equipId)
      setShowEquipmentSelector(null)
    }
  }

  // 各成選択ハンドラー
  const handleAwakeningSelect = (stage: number | null) => {
    if (onAwakeningSelect && !isEmpty) {
      onAwakeningSelect(characterId, stage)
    }
  }

  // Get equipment details
  const weaponEquipment = equipment.weapon ? getEquipment(equipment.weapon) : null
  const armorEquipment = equipment.armor ? getEquipment(equipment.armor) : null
  const accessoryEquipment = equipment.accessory ? getEquipment(equipment.accessory) : null

  return (
    <div className="flex flex-col relative" ref={characterSlotRef}>
      {/* Character Card - 모바일에서도 적절한 크기로 표시되도록 수정 */}
      <div
        className={`
          relative w-full aspect-[3/4] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden
          ${
            isEmpty
              ? "flex items-center justify-center cursor-pointer border border-[hsla(var(--neon-white),0.3)] bg-black bg-opacity-70 hover:bg-white hover:bg-opacity-10"
              : "cursor-pointer character-slot-filled hover:bg-white hover:bg-opacity-10"
          }
          transition-all duration-200
        `}
        onClick={onAddCharacter}
        style={characterSlotStyle}
      >
        {isEmpty ? (
          <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-[hsl(var(--neon-white))]" />
        ) : character ? (
          <div className="w-full h-full relative">
            {/* Character background image - now fully opaque */}
            <div className="absolute inset-0 w-full h-full">
              {character.img_card && (
                <img
                  src={character.img_card || "/images/placeholder.svg"}
                  alt={t(character.name)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Overlay - reduced opacity for better visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Content */}
            <div className="relative z-10 p-1 lg:p-3 flex flex-col h-full">
              {/* Character action buttons - 상단에 위치 */}
              <div className="flex justify-between w-full">
                {/* 리더 임명 버튼 또는 리더 왕관 뱃지 - 왼쪽 위 */}
                <div
                  style={{
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    minWidth: `${buttonSize}px`,
                    minHeight: `${buttonSize}px`,
                  }}
                >
                  {!isEmpty &&
                    (isLeader ? (
                      <div
                        className="bg-red-600 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          width: `${buttonSize}px`,
                          height: `${buttonSize}px`,
                          minWidth: `${buttonSize}px`,
                          minHeight: `${buttonSize}px`,
                          border: "1px solid #f59e0b",
                          boxShadow: "0 0 8px rgba(245, 158, 11, 0.6)",
                        }}
                      >
                        <Crown className="w-3/4 h-3/4 text-yellow-300" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSetLeader()
                        }}
                        aria-label={t("set_as_leader") || "Set as leader"}
                        className="rounded-lg lg:rounded-xl character-action-btn hover:bg-black hover:bg-opacity-80 transition-all duration-300"
                        style={{
                          width: `${buttonSize}px`,
                          height: `${buttonSize}px`,
                          minWidth: `${buttonSize}px`,
                          minHeight: `${buttonSize}px`,
                        }}
                      >
                        <Crown className="w-3/4 h-3/4" />
                      </button>
                    ))}
                </div>

                {/* 정보 버튼 - 오른쪽 위 */}
                {!isEmpty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowCharacterDetails(true)
                    }}
                    aria-label={t("character.details") || "Character details"}
                    className="rounded-lg lg:rounded-xl character-action-btn"
                    style={{
                      width: `${buttonSize}px`,
                      height: `${buttonSize}px`,
                      minWidth: `${buttonSize}px`,
                      minHeight: `${buttonSize}px`,
                    }}
                  >
                    <Info className="w-3/4 h-3/4" />
                  </button>
                )}
              </div>
              <div className="mt-auto flex flex-col">
                {/* 각성 단계 표시 - 이름 위 왼쪽 정렬로 표시, 반응형으로 조정 */}
                {!isEmpty && (
                  <div className="w-max mb-1 inline-block px-0">
                    <div className="bg-purple-600 rounded-full px-1 py-0.5 lg:px-2 lg:py-1 shadow-lg flex items-center justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                      <span className="text-white text-xs sm:text-sm font-bold ml-0.5 sm:ml-1">
                        {awakeningStage !== null ? awakeningStage : 0}
                      </span>
                    </div>
                  </div>
                )}

                {/* 이름을 하단으로 이동, 각성 표시와 겹치지 않도록 패딩 추가 */}

                <h3 className="w-max mb-0 rounded-full inline-block bg-gray-800 bg-opacity-60 text-xs sm:text-lg lg:text-xl xl:text-2xl font-semibold text-white neon-text truncate px-1 pb-0">
                  {t(character.name)}
                </h3>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Equipment Slots - 모바일에서도 적절한 크기로 표시되도록 수정 */}
      <div className="mt-1 sm:mt-2 grid grid-cols-3 gap-0.5 sm:gap-1">
        {/* Weapon Slot - Sword 아이콘 사용 */}
        <div className={getEquipmentSlotClass(weaponEquipment)} onClick={() => handleEquipmentClick("weapon")}>
          {!weaponEquipment ? (
            <Sword className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--neon-white))]" />
          ) : (
            <div className="w-full h-full relative">
              {weaponEquipment.url ? (
                <img
                  src={weaponEquipment.url || "/placeholder.svg"}
                  alt={t(weaponEquipment.name)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement?.classList.add("flex", "items-center", "justify-center")
                    const textElement = document.createElement("span")
                    textElement.className = "text-[0.6rem] sm:text-xs text-center"
                    textElement.textContent = t(weaponEquipment.name).substring(0, 2)
                    e.currentTarget.parentElement?.appendChild(textElement)
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <span className="text-[0.6rem] sm:text-xs text-center">
                    {t(weaponEquipment.name).substring(0, 2)}
                  </span>
                </div>
              )}

              {/* 장비 이름 - 슬롯 내부 하단에 표시 (모바일에서는 숨김) */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-1 py-0.5 text-[0.5rem] sm:text-sm text-center truncate neon-text hidden xl:block">
                {t(weaponEquipment.name)}
              </div>

              {/* 장비 정보 버튼 - 슬롯 내부 오른쪽 상단에 표시 */}
              <button
                className="equipment-info-btn hidden lg:flex"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEquipmentDetails(equipment.weapon)
                }}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Armor Slot - Shield 아이콘 사용 */}
        <div className={getEquipmentSlotClass(armorEquipment)} onClick={() => handleEquipmentClick("armor")}>
          {!armorEquipment ? (
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--neon-white))]" />
          ) : (
            <div className="w-full h-full relative">
              {armorEquipment.url ? (
                <img
                  src={armorEquipment.url || "/placeholder.svg"}
                  alt={t(armorEquipment.name)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement?.classList.add("flex", "items-center", "justify-center")
                    const textElement = document.createElement("span")
                    textElement.className = "text-[0.6rem] sm:text-xs text-center"
                    textElement.textContent = t(armorEquipment.name).substring(0, 2)
                    e.currentTarget.parentElement?.appendChild(textElement)
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <span className="text-[0.6rem] sm:text-xs text-center">
                    {t(armorEquipment.name).substring(0, 2)}
                  </span>
                </div>
              )}

              {/* 장비 이름 - 슬롯 내부 하단에 표시 (모바일에서는 숨김) */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-1 py-0.5 text-[0.5rem] sm:text-sm text-center truncate neon-text hidden xl:block">
                {t(armorEquipment.name)}
              </div>

              {/* 장비 정보 버튼 - 슬롯 내부 오른쪽 상단에 표시 */}
              <button
                className="equipment-info-btn hidden lg:flex"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEquipmentDetails(equipment.armor)
                }}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Accessory Slot - Gem 아이콘 사용 */}
        <div className={getEquipmentSlotClass(accessoryEquipment)} onClick={() => handleEquipmentClick("accessory")}>
          {!accessoryEquipment ? (
            <Gem className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--neon-white))]" />
          ) : (
            <div className="w-full h-full relative">
              {accessoryEquipment.url ? (
                <img
                  src={accessoryEquipment.url || "/placeholder.svg"}
                  alt={t(accessoryEquipment.name)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement?.classList.add("flex", "items-center", "justify-center")
                    const textElement = document.createElement("span")
                    textElement.className = "text-[0.6rem] sm:text-xs text-center"
                    textElement.textContent = t(accessoryEquipment.name).substring(0, 2)
                    e.currentTarget.parentElement?.appendChild(textElement)
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <span className="text-[0.6rem] sm:text-xs text-center">
                    {t(accessoryEquipment.name).substring(0, 2)}
                  </span>
                </div>
              )}

              {/* 장비 이름 - 슬롯 내부 하단에 표시 (모바일에서는 숨김) */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-1 py-0.5 text-[0.5rem] sm:text-sm text-center truncate neon-text hidden xl:block">
                {t(accessoryEquipment.name)}
              </div>

              {/* 장비 정보 버튼 - 슬롯 내부 오른쪽 상단에 표시 */}
              <button
                className="equipment-info-btn hidden lg:flex"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEquipmentDetails(equipment.accessory)
                }}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {showEquipmentSelector && (
        <EquipmentSearchModal
          isOpen={true}
          onClose={() => setShowEquipmentSelector(null)}
          title={
            <h3 className="text-lg font-bold neon-text">
              {t(`select_${showEquipmentSelector}`) ||
                `Select ${showEquipmentSelector.charAt(0).toUpperCase() + showEquipmentSelector.slice(1)}`}
            </h3>
          }
          equipments={
            data.equipments
              ? (Object.values(data.equipments) as Equipment[]).filter((equip) => equip.type === showEquipmentSelector)
              : []
          }
          onSelectEquipment={handleEquipItem}
          type={showEquipmentSelector}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex justify-end">
              <button
                onClick={() => setShowEquipmentSelector(null)}
                className="neon-button px-4 py-2 rounded-lg text-sm"
              >
                {t("close")}
              </button>
            </div>
          }
          getSkill={getSkill}
        />
      )}

      {/* 캐릭터 상세 정보 모달 */}
      {showCharacterDetails && character && (
        <CharacterDetailsModal
          isOpen={showCharacterDetails}
          onClose={() => setShowCharacterDetails(false)}
          character={character}
          getCardInfo={getCardInfo}
          getSkill={getSkill}
          data={data}
          selectedAwakeningStage={awakeningStage}
          onAwakeningSelect={handleAwakeningSelect}
        />
      )}

      {/* 장비 상세 정보 모달 */}
      {showEquipmentDetails && (
        <EquipmentDetailsModal
          isOpen={!!showEquipmentDetails}
          onClose={() => setShowEquipmentDetails(null)}
          equipment={getEquipment(showEquipmentDetails)!}
          getSkill={getSkill}
        />
      )}
    </div>
  )
}
