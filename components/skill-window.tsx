"use client"

import type React from "react"
import type { Card, CardExtraInfo } from "../types"
import { SkillCard } from "./skill-card"
import { CardSettingsModal } from "./card-settings-modal"
import { TabbedInterface } from "./tabbed-interface"
import { DeckStats } from "./deck-stats"
import { useSkillWindow } from "../hooks/deck-builder/useSkillWindow"
import { SkillPriorityTab } from "./skill-window/skill-priority-tab"

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core"
import { useTranslations } from "next-intl"

interface SkillWindowProps {
  selectedCards: {
    id: string
    useType: number
    useParam: number
    useParamMap?: Record<string, number>
    skillId?: number
  }[]
  availableCards: { card: Card; extraInfo: CardExtraInfo; characterImage?: string }[]
  onRemoveCard: (cardId: string) => void
  onReorderCards: (fromIndex: number, toIndex: number) => void
  onUpdateCardSettings: (
    cardId: string,
    useType: number,
    useParam: number,
    useParamMap?: Record<string, number>,
  ) => void
  data: any
  leaderCharacter?: number
}

export function SkillWindow({
  selectedCards,
  availableCards,
  onRemoveCard,
  onReorderCards,
  onUpdateCardSettings,
  data,
  leaderCharacter,
}: SkillWindowProps) {
  const t = useTranslations()

  // Use custom hook for all business logic
  const {
    editingCard,
    activeId,
    includeDerivedCards,
    setIncludeDerivedCards,
    skillContainerRef,
    activeCards,
    statusEffects,
    sensors,
    editingCardInfo,
    editingCardSettings,
    activeCardInfo,
    handleEditCard,
    handleSaveCardSettings,
    handleCloseModal,
    handleDragStart,
    handleDragEnd,
  } = useSkillWindow({
    selectedCards,
    availableCards,
    onUpdateCardSettings,
    data,
  })

  // Handle drag end with reordering
  const onDragEnd = (event: any) => {
    const result = handleDragEnd(event)
    if (result && result.oldIndex !== -1 && result.newIndex !== -1) {
      onReorderCards(result.oldIndex, result.newIndex)
    }
  }

  return (
    <div className="w-full">
      {/* 제목 부분 제거 - DeckBuilder에서 관리하도록 변경 */}

      {/* 스킬 그리드 컨테이너의 패딩을 줄이고 여백을 최소화합니다 */}
      {/* neon-container 클래스가 있는 div의 패딩을 수정합니다 */}
      <div ref={skillContainerRef} className="neon-container p-0 min-h-[300px] overflow-hidden skill-container w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
        >
          <TabbedInterface
            tabs={[
              {
                id: "priority",
                label: t("skill_priority") || "Skill Priority",
                content: (
                  <SkillPriorityTab
                    selectedCards={selectedCards}
                    availableCards={availableCards}
                    onRemoveCard={onRemoveCard}
                    onReorderCards={onReorderCards}
                    onEditCard={handleEditCard}
                    activeId={activeId}
                    activeCardInfo={activeCardInfo ?? null}
                    statusEffects={statusEffects.filter(
                      (e) => e !== null && e.name !== undefined,
                    ) as Array<{
                      id: string
                      name: string
                      color: string
                      description: string
                      source: "normal" | "derived" | "both"
                    }>}
                    includeDerivedCards={includeDerivedCards}
                    data={data}
                    leaderCharacter={leaderCharacter}
                  />
                ),
              },
              {
                id: "stats",
                label: t("deck_stats") || "Deck Stats",
                content: (
                  <DeckStats
                    selectedCards={selectedCards}
                    availableCards={availableCards}
                    data={data}
                    statusEffects={statusEffects}
                    includeDerivedCards={includeDerivedCards}
                    setIncludeDerivedCards={setIncludeDerivedCards}
                  />
                ),
              },
            ]}
            defaultTabId="priority"
          />

          <DragOverlay adjustScale={true}>
            {activeId && activeCardInfo && (
              <div className="dragging-overlay">
                <SkillCard
                  card={activeCardInfo.card}
                  extraInfo={activeCardInfo.extraInfo}
                  onRemove={() => {}}
                  onEdit={() => {}}
                  isDisabled={false}
                  characterImage={activeCardInfo.characterImage}
                  useType={selectedCards.find((c) => c.id === activeId)?.useType || 1}
                  useParam={selectedCards.find((c) => c.id === activeId)?.useParam || -1}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {editingCard && editingCardInfo && editingCardSettings && (
        <CardSettingsModal
          isOpen={true}
          onClose={handleCloseModal}
          card={editingCardInfo.card}
          extraInfo={editingCardInfo.extraInfo}
          initialUseType={editingCardSettings.useType}
          initialUseParam={editingCardSettings.useParam}
          initialUseParamMap={editingCardSettings.useParamMap}
          onSave={handleSaveCardSettings}
          characterImage={editingCardInfo.characterImage}
        />
      )}
    </div>
  )
}
