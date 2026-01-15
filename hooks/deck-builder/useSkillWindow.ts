import { useState, useEffect, useRef, useMemo } from "react"
import { useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core"
import type { Card, CardExtraInfo } from "@/types"
import { tagDb } from "@/lib/tagDb"
import { tagColorMapping } from "@/lib/tagColorMapping"

interface UseSkillWindowProps {
  selectedCards: {
    id: string
    useType: number
    useParam: number
    useParamMap?: Record<string, number>
    skillId?: number
  }[]
  availableCards: { card: Card; extraInfo: CardExtraInfo; characterImage?: string }[]
  onUpdateCardSettings: (
    cardId: string,
    useType: number,
    useParam: number,
    useParamMap?: Record<string, number>,
  ) => void
  data: any
}

export function useSkillWindow({
  selectedCards,
  availableCards,
  onUpdateCardSettings,
  data,
}: UseSkillWindowProps) {
  // State management
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [includeDerivedCards, setIncludeDerivedCards] = useState(true)
  const skillContainerRef = useRef<HTMLDivElement>(null)

  // Touch device detection
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0,
      )
    }

    detectTouch()
    window.addEventListener("resize", detectTouch)

    return () => {
      window.removeEventListener("resize", detectTouch)
    }
  }, [])

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  )

  // Get active cards (not disabled)
  const activeCards = useMemo(() => {
    return selectedCards
      .filter((card) => card.useType !== 2)
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

  // Classify normal and derived cards
  const { normalCards, derivedCards } = useMemo(() => {
    if (!data) return { normalCards: [], derivedCards: [] }

    const normal: typeof activeCards = []
    const derived: typeof activeCards = []

    activeCards.forEach((cardInfo) => {
      let isDerived = true

      if (cardInfo.selectedCard.skillId) {
        for (const charId in data.charSkillMap) {
          const charSkillMap = data.charSkillMap[charId]

          if (charSkillMap.skills && charSkillMap.skills.includes(cardInfo.selectedCard.skillId)) {
            isDerived = false
            break
          }
        }
      } else {
        isDerived = false
      }

      if (isDerived) {
        derived.push(cardInfo)
      } else {
        normal.push(cardInfo)
      }
    })

    return { normalCards: normal, derivedCards: derived }
  }, [activeCards, data])

  // Calculate status effects
  const statusEffects = useMemo(() => {
    if (Object.keys(tagDb).length === 0 || Object.keys(tagColorMapping).length === 0) {
      return []
    }

    const tagToColorMap: Record<string, string> = {}

    Object.entries(tagColorMapping).forEach(([colorCode, tagIds]) => {
      tagIds.forEach((tagId) => {
        tagToColorMap[tagId.toString()] = colorCode
      })
    })

    const normalTagIds = new Set<string>()
    const derivedTagIds = new Set<string>()

    normalCards.forEach(({ card }) => {
      if (card.tagList && Array.isArray(card.tagList)) {
        card.tagList.forEach((tagItem) => {
          if (tagItem && tagItem.tagId) {
            normalTagIds.add(tagItem.tagId.toString())
          }
        })
      }
    })

    derivedCards.forEach(({ card }) => {
      if (card.tagList && Array.isArray(card.tagList)) {
        card.tagList.forEach((tagItem) => {
          if (tagItem && tagItem.tagId) {
            derivedTagIds.add(tagItem.tagId.toString())
          }
        })
      }
    })

    const allTagIds = new Set([...normalTagIds, ...derivedTagIds])

    return Array.from(allTagIds)
      .map((tagId) => {
        const tag = tagDb[tagId]
        if (!tag) return null

        const colorCode = tagToColorMap[tagId]
        if (!colorCode) return null

        let source: "normal" | "derived" | "both" = "normal"
        if (normalTagIds.has(tagId) && derivedTagIds.has(tagId)) {
          source = "both"
        } else if (derivedTagIds.has(tagId)) {
          source = "derived"
        }

        return {
          id: tagId,
          name: tag.tagName,
          color: colorCode,
          description: tag.detail || "",
          source,
        }
      })
      .filter(Boolean)
  }, [normalCards, derivedCards])

  // Event handlers
  const handleEditCard = (cardId: string) => {
    setEditingCard(cardId)
  }

  const handleSaveCardSettings = (
    cardId: string,
    useType: number,
    useParam: number,
    useParamMap?: Record<string, number>,
  ) => {
    onUpdateCardSettings(cardId, useType, useParam, useParamMap)
  }

  const handleCloseModal = () => setEditingCard(null)

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)

    document.body.style.overflow = "hidden"
    document.body.classList.add("dragging")

    if (skillContainerRef.current) {
      skillContainerRef.current.classList.add("dragging-container")
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    document.body.style.overflow = ""
    document.body.classList.remove("dragging")

    if (skillContainerRef.current) {
      skillContainerRef.current.classList.remove("dragging-container")
    }

    setActiveId(null)

    if (!over || active.id === over.id) return

    const oldIndex = selectedCards.findIndex((card) => card.id === active.id)
    const newIndex = selectedCards.findIndex((card) => card.id === over.id)

    return { oldIndex, newIndex }
  }

  // Derived data
  const editingCardInfo = editingCard ? availableCards.find((c) => c.card.id.toString() === editingCard) : null
  const editingCardSettings = editingCard ? selectedCards.find((c) => c.id === editingCard) : null
  const activeCardInfo = activeId ? availableCards.find((c) => c.card.id.toString() === activeId) : null

  return {
    // State
    editingCard,
    activeId,
    isTouchDevice,
    includeDerivedCards,
    setIncludeDerivedCards,
    skillContainerRef,

    // Computed data
    activeCards,
    normalCards,
    derivedCards,
    statusEffects,
    sensors,
    editingCardInfo,
    editingCardSettings,
    activeCardInfo,

    // Event handlers
    handleEditCard,
    handleSaveCardSettings,
    handleCloseModal,
    handleDragStart,
    handleDragEnd,
  }
}
