import { useState, useEffect, useRef } from "react"

interface UseCharacterSlotProps {
  isEmpty: boolean
  character: any
}

export function useCharacterSlot({ isEmpty, character }: UseCharacterSlotProps) {
  // State management
  const [showEquipmentSelector, setShowEquipmentSelector] = useState<"weapon" | "armor" | "accessory" | null>(null)
  const [showCharacterDetails, setShowCharacterDetails] = useState(false)
  const [showEquipmentDetails, setShowEquipmentDetails] = useState<string | null>(null)
  const [slotWidth, setSlotWidth] = useState(0)
  const characterSlotRef = useRef<HTMLDivElement>(null)

  // Measure slot width for dynamic button sizing
  useEffect(() => {
    const updateSlotWidth = () => {
      if (characterSlotRef.current) {
        setSlotWidth(characterSlotRef.current.offsetWidth)
      }
    }

    updateSlotWidth()
    window.addEventListener("resize", updateSlotWidth)

    return () => {
      window.removeEventListener("resize", updateSlotWidth)
    }
  }, [])

  // Style calculation functions
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "UR":
        return "bg-gradient-to-r from-orange-500 to-amber-500"
      case "SSR":
        return "bg-gradient-to-r from-yellow-500 to-amber-500"
      case "SR":
        return "bg-gradient-to-r from-purple-500 to-indigo-500"
      case "R":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEquipmentQualityBgColor = (quality: string) => {
    switch (quality) {
      case "Orange":
        return "bg-gradient-to-br from-orange-500 to-red-500"
      case "Golden":
        return "bg-gradient-to-br from-yellow-500 to-amber-500"
      case "Purple":
        return "bg-gradient-to-br from-purple-500 to-indigo-500"
      case "Blue":
        return "bg-gradient-to-br from-blue-500 to-cyan-500"
      case "Green":
        return "bg-gradient-to-br from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-500"
    }
  }

  const getRarityBorderStyle = (rarity: string) => {
    switch (rarity) {
      case "UR":
        return {
          borderColor: "#f97316",
          boxShadow: "0 0 10px rgba(249, 115, 22, 0.7), 0 0 15px rgba(249, 115, 22, 0.4)",
        }
      case "SSR":
        return {
          borderColor: "#eab308",
          boxShadow: "0 0 10px rgba(234, 179, 8, 0.7), 0 0 15px rgba(234, 179, 8, 0.4)",
        }
      case "SR":
        return {
          borderColor: "#a855f7",
          boxShadow: "0 0 10px rgba(168, 85, 247, 0.7), 0 0 15px rgba(168, 85, 247, 0.4)",
        }
      case "R":
        return {
          borderColor: "#3b82f6",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.7), 0 0 15px rgba(59, 130, 246, 0.4)",
        }
      default:
        return {
          borderColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
        }
    }
  }

  // Computed styles
  const characterSlotStyle =
    !isEmpty && character
      ? {
          border: "2px solid",
          ...getRarityBorderStyle(character.rarity),
        }
      : {}

  const buttonSize = Math.max(slotWidth * 0.25, 20)
  const crownSize = Math.max(slotWidth * 0.33, 24)

  const getEquipmentSlotClass = (equipment: any) => `
    w-full aspect-square rounded-lg overflow-hidden cursor-pointer relative flex items-center justify-center
    ${isEmpty ? "opacity-50 pointer-events-none" : ""}
    ${!equipment ? "equipment-slot-empty neon-border" : getEquipmentQualityBgColor(equipment.quality)}
  `

  // Event handlers
  const handleEquipmentClick = (type: "weapon" | "armor" | "accessory") => {
    if (isEmpty) return
    setShowEquipmentSelector(type)
  }

  const handleOpenCharacterDetails = () => {
    if (isEmpty) return
    setShowCharacterDetails(true)
  }

  return {
    // State
    showEquipmentSelector,
    setShowEquipmentSelector,
    showCharacterDetails,
    setShowCharacterDetails,
    showEquipmentDetails,
    setShowEquipmentDetails,
    slotWidth,
    characterSlotRef,

    // Computed styles
    characterSlotStyle,
    buttonSize,
    crownSize,

    // Style functions
    getRarityColor,
    getEquipmentQualityBgColor,
    getEquipmentSlotClass,

    // Event handlers
    handleEquipmentClick,
    handleOpenCharacterDetails,
  }
}
