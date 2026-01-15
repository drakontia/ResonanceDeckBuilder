"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import type { Card, CardExtraInfo, Tag, TagColorMapping } from "../types"
import { SkillCard } from "./skill-card"
import { CardSettingsModal } from "./card-settings-modal"
import { TabbedInterface } from "./tabbed-interface"
import { DeckStats } from "./deck-stats"
import { tagDb } from "@/lib/tagDb"
import { tagColorMapping } from "@/lib/tagColorMapping"
import { useSkillWindow } from "../hooks/deck-builder/useSkillWindow"

// dnd-kit import - MouseSensor와 TouchSensor 추가
import { DndContext, closestCenter, useSensor, useSensors, DragOverlay, MouseSensor, TouchSensor } from "@dnd-kit/core"
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
  onAddCard: (cardId: string) => void
  onRemoveCard: (cardId: string) => void
  onReorderCards: (fromIndex: number, toIndex: number) => void
  onUpdateCardSettings: (
    cardId: string,
    useType: number,
    useParam: number,
    useParamMap?: Record<string, number>,
  ) => void
  data: any
}

function SortableSkillCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    position: "relative" as const,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-manipulation ${isDragging ? "dragging-card" : ""}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  )
}

// 태그 컴포넌트 - 파생카드 토글 상태에 따라 표시/숨김 처리
function StatusEffectTags({
  statusEffects,
  includeDerivedCards,
  forceShowAll = false, // 모든 태그를 강제로 표시할지 여부
}: {
  statusEffects: {
    id: string
    name: string
    color: string
    description: string
    source: "normal" | "derived" | "both"
  }[]
  includeDerivedCards: boolean
  forceShowAll?: boolean
}) {
  const t = useTranslations()
  return (
    <div className="neon-container p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4 neon-text">
        {t("status_effects") || "Status Effects"}
      </h3>
      {statusEffects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {statusEffects.map((effect) => (
            <div
              key={effect.id}
              className={`relative group tooltip-group ${
                !forceShowAll && !includeDerivedCards && effect.source === "derived" ? "hidden" : ""
              }`}
              onMouseEnter={(e) => {
                const tag = e.currentTarget
                const tagRect = tag.getBoundingClientRect()
                const tooltipWidth = 256 // 툴팁 너비
                const screenWidth = window.innerWidth

                // 태그의 중앙이 화면 중앙보다 오른쪽에 있는지 확인
                if (tagRect.left + tagRect.width / 2 > screenWidth / 2) {
                  // 오른쪽에 있으면 툴팁을 왼쪽으로 정렬
                  tag.style.setProperty("--tooltip-x", `${Math.max(tagRect.left - tooltipWidth, 10)}px`)
                  tag.style.setProperty("--tooltip-align", "left")
                } else {
                  // 왼쪽에 있으면 툴팁을 오른쪽으로 정렬
                  tag.style.setProperty("--tooltip-x", `${tagRect.right}px`)
                  tag.style.setProperty("--tooltip-align", "right")
                }

                // Y 위치는 태그 위에 표시
                const tooltipY = tagRect.top - 10
                tag.style.setProperty("--tooltip-y", `${tooltipY}px`)
              }}
            >
              <span
                className="px-2 py-1 bg-black bg-opacity-50 border rounded-md text-sm cursor-help"
                style={{
                  borderColor: effect.color,
                  color: effect.color,
                  boxShadow: `0 0 5px ${effect.color}40`,
                }}
              >
                {t(effect.name) || effect.name}
              </span>

              {/* 툴팁 */}
              <div
                className="fixed p-2 rounded text-xs text-gray-300 
                          invisible group-hover:visible z-10 border border-gray-700 pointer-events-none
                          bg-black bg-opacity-90 shadow-lg w-64"
                style={{
                  // 화면 위치에 따라 동적으로 위치 조정
                  left: "var(--tooltip-x, 0)",
                  top: "var(--tooltip-y, 0)",
                }}
              >
                <div className="font-bold mb-1" style={{ color: effect.color }}>
                  {t(effect.name) || effect.name}
                </div>
                <div>{t(effect.description) || effect.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{t("no_status_effects") || "No status effects found"}</p>
      )}
    </div>
  )
}

// SkillCard 컴포넌트에서 selectedCards의 저장된 정보를 직접 사용하도록 수정
function SkillPriorityTab({
  selectedCards,
  availableCards,
  onRemoveCard,
  onReorderCards,
  onEditCard,
  activeId,
  activeCardInfo,
  statusEffects,
  includeDerivedCards,
  data,
}: {
  selectedCards: {
    id: string
    useType: number
    useParam: number
    useParamMap?: Record<string, number>
    skillInfo?: any
    cardInfo?: any
    extraInfo?: any
  }[]
  availableCards: { card: Card; extraInfo: CardExtraInfo; characterImage?: string }[]
  onRemoveCard: (cardId: string) => void
  onReorderCards: (fromIndex: number, toIndex: number) => void
  onEditCard: (cardId: string) => void
  activeId: string | null
  activeCardInfo: { card: Card; extraInfo: CardExtraInfo; characterImage?: string } | null
  statusEffects: any[]
  includeDerivedCards: boolean
  data: any
}) {
  const t = useTranslations()
  return (
    <div className="w-full">
      {selectedCards.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          {t("no.skill.cards") || "No skill cards"}
        </div>
      ) : (
        <SortableContext items={selectedCards.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="skill-grid w-full">
            {selectedCards.map((selectedCard) => {
              // 항상 availableCards에서 카드 정보 찾기 (CardSettingsModal과 동일한 방식)
              const cardInfo = availableCards.find((c) => c.card.id.toString() === selectedCard.id.toString())

              if (!cardInfo) {
                return null
              }

              const { card, extraInfo, characterImage } = cardInfo
              const isDisabled = selectedCard.useType === 2

              return (
                <SortableSkillCard key={selectedCard.id} id={selectedCard.id}>
                  <SkillCard
                    card={card}
                    extraInfo={extraInfo}
                    onRemove={() => onRemoveCard(selectedCard.id)}
                    onEdit={() => onEditCard(selectedCard.id)}
                    isDisabled={isDisabled}
                    characterImage={characterImage}
                    useType={selectedCard.useType}
                    useParam={selectedCard.useParam}
                  />
                </SortableSkillCard>
              )
            })}
          </div>
        </SortableContext>
      )}

      {/* 드래그 오버레이 추가 - 드래그 중인 카드의 시각적 표현 */}
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

      {/* 상태 효과(태그) 표시 */}
      <StatusEffectTags
        statusEffects={statusEffects}
        includeDerivedCards={includeDerivedCards}
        forceShowAll={true} // 우선순위 탭에서는 항상 모든 태그 표시
      />
    </div>
  )
}

export function SkillWindow({
  selectedCards,
  availableCards,
  onAddCard,
  onRemoveCard,
  onReorderCards,
  onUpdateCardSettings,
  data,
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
                    statusEffects={statusEffects}
                    includeDerivedCards={includeDerivedCards}
                    data={data}
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
