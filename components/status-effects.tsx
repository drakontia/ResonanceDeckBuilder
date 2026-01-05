"use client"

import { useEffect, useState, useMemo } from "react"
import type { Card, CardExtraInfo, Tag, TagColorMapping } from "../types"
import { tagDb } from "@/lib/tagDb"
import { tagColorMapping } from "@/lib/tagColorMapping"

interface StatusEffectsProps {
  selectedCards: { id: string; useType: number; useParam: number; useParamMap?: Record<string, number> }[]
  availableCards: { card: Card; extraInfo: CardExtraInfo; characterImage?: string }[]
  data: any
}

export function StatusEffects({ selectedCards, availableCards, getTranslatedString, data }: StatusEffectsProps) {
  // Get the cards that are actually in the deck (not disabled)
  const activeCards = useMemo(() => {
    return selectedCards
      .filter((card) => card.useType !== 2) // Filter out disabled cards
      .map((selectedCard) => {
        const cardInfo = availableCards.find((c) => c.card.id.toString() === selectedCard.id)
        return cardInfo ? { ...cardInfo, selectedCard } : null
      })
      .filter(Boolean) as {
      card: Card
      extraInfo: CardExtraInfo
      characterImage?: string
      selectedCard: any
    }[]
  }, [selectedCards, availableCards])

  // Get status effects from tagList
  const statusEffects = useMemo(() => {
    // 모든 태그 ID를 색상 코드에 매핑하는 객체 생성
    const tagToColorMap: Record<string, string> = {}

    // 색상 코드별 태그 ID 배열을 순회하며 매핑 생성
    Object.entries(tagColorMapping).forEach(([colorCode, tagIds]) => {
      tagIds.forEach((tagId) => {
        tagToColorMap[tagId.toString()] = colorCode
      })
    })

    const effectIds = new Set<string>()

    activeCards.forEach(({ card }) => {
      if (card.tagList && Array.isArray(card.tagList)) {
        card.tagList.forEach((tagItem) => {
          // tagList는 객체 배열이며 각 객체에는 tagId 속성이 있음
          if (tagItem && tagItem.tagId) {
            effectIds.add(tagItem.tagId.toString())
          }
        })
      }
    })

    // Map tagIds to tag names and colors
    return Array.from(effectIds)
      .map((tagId) => {
        const tag = tagDb[tagId]
        if (!tag) return null

        // 색상 매핑에 있는 태그만 포함
        const colorCode = tagToColorMap[tagId]
        if (!colorCode) return null

        // Get translated tag name and description
        const tagName = t(tag.tagName) || tag.tagName
        const tagDesc = t(tag.detail) || tag.detail || ""

        return {
          id: tagId,
          name: tagName,
          color: colorCode,
          description: tagDesc, // 태그 설명 추가
        }
      })
      .filter(Boolean)
  }, [activeCards, tagDb, tagColorMapping, getTranslatedString])

  return (
    <div className="neon-container p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4 neon-text">
        {t("status_effects") || "Status Effects"}
      </h3>
      {statusEffects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {statusEffects.map((effect) => (
            <div key={effect.id} className="relative group">
              <span
                className="px-2 py-1 bg-black bg-opacity-50 border rounded-md text-sm cursor-help"
                style={{
                  borderColor: effect.color,
                  color: effect.color,
                  boxShadow: `0 0 5px ${effect.color}40`,
                }}
              >
                {effect.name}
              </span>

              {/* 툴팁 */}
              <div
                className="absolute left-0 bottom-full mb-2 w-64 bg-black bg-opacity-90 p-2 rounded text-xs text-gray-300 
                             invisible group-hover:visible z-10 border border-gray-700 pointer-events-none"
              >
                <div className="font-bold mb-1" style={{ color: effect.color }}>
                  {effect.name}
                </div>
                <div>{effect.description}</div>
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
