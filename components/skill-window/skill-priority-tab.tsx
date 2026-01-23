"use client"

import type React from "react"
import type { Card, CardExtraInfo } from "@/types"
import { SkillCard } from "@/components/skill-card"
import { SortableSkillCard } from "./sortable-skill-card"
import { StatusEffectTags } from "./status-effect-tags"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { useTranslations } from "next-intl"

interface StatusEffect {
  id: string
  name: string
  color: string
  description: string
  source: "normal" | "derived" | "both"
}

interface SkillPriorityTabProps {
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
  statusEffects: StatusEffect[]
  includeDerivedCards: boolean
  data: any
  leaderCharacter?: number
}

export function SkillPriorityTab({
  selectedCards,
  availableCards,
  onRemoveCard,
  onReorderCards,
  onEditCard,
  activeId,
  activeCardInfo,
  statusEffects,
  includeDerivedCards,
  leaderCharacter,
}: SkillPriorityTabProps) {
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
              const cardInfo = availableCards.find((c) => c.card.id.toString() === selectedCard.id.toString())

              if (!cardInfo) {
                return null
              }

              const { card, extraInfo, characterImage } = cardInfo
              const isDisabled = selectedCard.useType === 2

              return (
                <SortableSkillCard key={selectedCard.id} id={selectedCard.id}>
                  <SkillCard
                    card={{ ...card }}
                    extraInfo={extraInfo}
                    onRemove={() => onRemoveCard(selectedCard.id)}
                    onEdit={() => onEditCard(selectedCard.id)}
                    isDisabled={isDisabled}
                    characterImage={characterImage}
                    useType={selectedCard.useType}
                    useParam={selectedCard.useParam}
                    leaderCharacter={leaderCharacter}
                  />
                </SortableSkillCard>
              )
            })}
          </div>
        </SortableContext>
      )}

      <StatusEffectTags
        statusEffects={statusEffects}
        includeDerivedCards={includeDerivedCards}
        forceShowAll={true}
      />
    </div>
  )
}
