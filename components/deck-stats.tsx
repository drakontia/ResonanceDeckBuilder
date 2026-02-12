"use client"

import { useMemo } from "react"
import type { Card, CardExtraInfo } from "../types"
import { useTranslations } from "next-intl"
import { ColorDistributionChart } from "./deck-stats/ColorDistributionChart"
import { CardsByColor } from "./deck-stats/CardsByColor"
import { StatusEffectsDisplay } from "./deck-stats/StatusEffectsDisplay"

interface DeckStatsProps {
  selectedCards: {
    id: string
    useType: number
    useParam: number
    useParamMap?: Record<string, number>
    skillId?: number
  }[]
  availableCards: { card: Card; extraInfo: CardExtraInfo; characterImage?: string }[]
  data: any
  statusEffects: any[] // 상위 컴포넌트에서 계산된 statusEffects를 받음
  includeDerivedCards: boolean
  setIncludeDerivedCards: (include: boolean) => void
}

export function DeckStats({
  selectedCards,
  availableCards,
  data,
  statusEffects,
  includeDerivedCards,
  setIncludeDerivedCards,
}: DeckStatsProps) {
  const t = useTranslations()

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

  // Filter cards based on includeDerivedCards toggle
  const filteredCards = useMemo(() => {
    if (!data || includeDerivedCards) {
      // Include all cards
      return activeCards
    }

    // If derived cards should be excluded, filter based on char_skill_map
    return activeCards.filter((cardInfo) => {
      // If no skillId, we can't determine if it's derived, so include it
      if (!cardInfo.selectedCard.skillId) return true

      // Check all characters in char_skill_map
      for (const charId in data.charSkillMap) {
        const charSkillMap = data.charSkillMap[charId]

        // If the skill is in the skills array, it's not derived
        if (charSkillMap.skills && charSkillMap.skills.includes(cardInfo.selectedCard.skillId)) {
          return true
        }
      }

      // If not found in any character's skills array, it's derived
      return false
    })
  }, [activeCards, includeDerivedCards, data])

  // 색상 순서 배열 추가
  const colorOrder = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Unknown"]

  // Color mapping for the chart
  const colorMap: Record<string, string> = {
    Red: "#ef4444",
    Blue: "#3b82f6",
    Yellow: "#eab308",
    Green: "#22c55e",
    Purple: "#a855f7",
    Orange: "#f97316",
    Unknown: "#6b7280",
  }

  // Get color distribution with quantities
  const colorDistribution = useMemo(() => {
    const colors: Record<
      string,
      { count: number; cards: { name: string; quantity: number; characterName?: string }[]; translatedName: string }
    > = {}

    filteredCards.forEach(({ card, extraInfo, selectedCard }) => {
      const originalColor = card.color || "Unknown"
      const quantity = extraInfo.amount || 1 // Use amount if available, otherwise default to 1

      // 원본 색상 이름을 저장 (차트 색상 매핑용)
      const colorKey = originalColor

      // 색상 이름 번역
      const translatedColor = t(`color_${originalColor.toLowerCase()}`) || originalColor

      if (!colors[colorKey]) {
        colors[colorKey] = { count: 0, cards: [], translatedName: translatedColor }
      }

      // 캐릭터 이름 가져오기
      let characterName = ""
      if (card.ownerId && card.ownerId !== -1 && data?.characters) {
        const character = data.characters[card.ownerId.toString()]
        if (character) {
          characterName = t(character.name) || character.name
        }
      } else if (selectedCard?.ownerId && selectedCard.ownerId !== -1 && data?.characters) {
        // selectedCard에서 ownerId 확인
        const character = data.characters[selectedCard.ownerId.toString()]
        if (character) {
          characterName = t(character.name) || character.name
        }
      }

      // Add the quantity to the count
      colors[colorKey].count += quantity

      // Check if the card is already in the list
      const existingCard = colors[colorKey].cards.find((c) => c.name === extraInfo.name)
      if (existingCard) {
        existingCard.quantity += quantity
      } else {
        colors[colorKey].cards.push({
          name: extraInfo.name,
          quantity,
          characterName: characterName || "", // 캐릭터 이름이 없으면 빈 문자열로 설정
        })
      }
    })

    return (
      Object.entries(colors)
        .map(([color, data]) => ({
          name: color,
          translatedName: data.translatedName,
          count: data.count,
          cards: data.cards,
          // 색상 순서 인덱스 추가
          orderIndex: colorOrder.indexOf(color) !== -1 ? colorOrder.indexOf(color) : colorOrder.length,
        }))
        // 색상 순서에 따라 정렬
        .sort((a, b) => a.orderIndex - b.orderIndex)
    )
  }, [filteredCards, data])

  // Total card count
  const totalCards = useMemo(() => {
    return colorDistribution.reduce((sum, color) => sum + color.count, 0)
  }, [colorDistribution])

  return (
    <div className="w-full space-y-6 p-4">
      {/* Derived Cards Toggle */}
      <div className="flex items-center mb-4">
        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out mr-3">
          <input
            type="checkbox"
            id="includeDerivedCards"
            checked={includeDerivedCards}
            onChange={(e) => setIncludeDerivedCards(e.target.checked)}
            className="opacity-0 w-0 h-0"
          />
          <label
            htmlFor="includeDerivedCards"
            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
              includeDerivedCards ? "bg-blue-600" : "bg-gray-700"
            }`}
            style={{
              boxShadow: includeDerivedCards ? "0 0 8px rgba(59, 130, 246, 0.8)" : "none",
            }}
          >
            <span
              className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ${
                includeDerivedCards ? "transform translate-x-6" : ""
              }`}
            ></span>
          </label>
        </div>
        <label htmlFor="includeDerivedCards" className="text-sm cursor-pointer select-none">
          {t("include_derived_cards") || "Include derived cards"}
        </label>
        <div className="ml-2 group relative">
          <span className="text-gray-400 cursor-help text-xs rounded-full border border-gray-500 px-1">?</span>
          <div className="absolute left-0 bottom-full mb-2 w-64 bg-black/90 p-2 rounded text-xs text-gray-300 invisible group-hover:visible z-10 border border-gray-700">
            {t("derived_cards_tooltip") ||
              "Derived cards are cards that are generated during battle and not directly owned by characters."}
          </div>
        </div>
      </div>

      {/* Total Card Count */}
      <div className="text-sm text-gray-300">
        {t("total_cards") || "Total Cards"}: {totalCards}
      </div>

      {/* Color Distribution Chart */}
      <ColorDistributionChart colorDistribution={colorDistribution} colorMap={colorMap} />

      {/* Cards by Color */}
      <CardsByColor colorDistribution={colorDistribution} colorMap={colorMap} />

      {/* Status Effects - 상위 컴포넌트에서 계산된 statusEffects를 사용 */}
      <StatusEffectsDisplay statusEffects={statusEffects} includeDerivedCards={includeDerivedCards} />
    </div>
  )
}
