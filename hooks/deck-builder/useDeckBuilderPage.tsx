"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { processSkillDescription } from "@/utils/skill-description"

import { useDeckBuilder } from "."
import { logEventWrapper } from "../../lib/firebase-config"
import { decodePresetFromUrlParam } from "../../utils/presetCodec"
import { getCurrentDeckId, removeCurrentDeckId, setCurrentDeckId, type SavedDeck } from "../../utils/local-storage"
import type { CardExtraInfo, Database } from "../../types"
import { useDataLoader } from "../use-data-loader"
import { useToast } from "../../components/toast-notification"

type AvailableCard = {
  card: any
  cardForImage: any
  extraInfo: CardExtraInfo
  characterImage?: string
}

export function useDeckBuilderPage(urlDeckCode: string | null) {
  const t = useTranslations()
  const locale = useLocale()
  const { showToast, ToastContainer } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  const { data, loading, error } = useDataLoader()

  const [isLocalLoading, setIsLocalLoading] = useState(true)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)

  const {
    selectedCharacters,
    leaderCharacter,
    selectedCards,
    battleSettings,
    equipment,
    awakening,
    getCharacter,
    getCard,
    getCardInfo,
    getEquipment,
    getSkill,
    allEquipments,
    addCharacter,
    removeCharacter,
    setLeader,
    addCard,
    removeCard,
    reorderCards,
    updateCardSettings,
    updateBattleSettings,
    updateEquipment,
    updateAwakening,
    clearAll,
    exportPreset,
    importPresetObject,
    createShareableUrl,
    decodePresetString,
    importPreset,
    createPresetObject,
    setSelectedCharacters,
    setLeaderCharacter,
  } = useDeckBuilder(data as Database | null)

  const findCharacterImageForCard = useCallback(
    (card: any) => {
      if (!data || !card) return "/images/placeHolderCard.jpg"

      if (card.ownerId && card.ownerId !== -1) {
        if (data.images && data.images[`char_${card.ownerId}`]) {
          return data.images[`char_${card.ownerId}`]
        }

        const character = data.characters[card.ownerId.toString()]
        if (character && character.img_card) {
          return character.img_card
        }
      }

      return "images/placeHolderCard.jpg"
    },
    [data],
  )



  useEffect(() => {
    if (initialLoadComplete || !data) return

    const loadFromUrl = () => {
      if (urlDeckCode) {
        try {
          const preset = decodePresetFromUrlParam(urlDeckCode)
          if (preset) {
            const result = importPresetObject(preset, true)
            if (result.success) {
              showToast(t(result.message), "success")
              removeCurrentDeckId()

              logEventWrapper("deck_shared_visit", {
                deck_code: urlDeckCode,
                language: locale,
              })
            }
          }
        } catch (err) {
          console.error("Error decoding URL preset:", err)
        }
      } else {
        const currentDeckId = getCurrentDeckId()
        if (currentDeckId) {
          // 자동 로드/알림 여부는 별도 처리 가능
        }
      }

      setIsLocalLoading(false)
      setInitialLoadComplete(true)
    }

    loadFromUrl()
  }, [data, urlDeckCode, importPresetObject, showToast, locale, initialLoadComplete, t])

  const availableCards: AvailableCard[] = useMemo(() => {
    if (!data) return []

    const cardSet = new Set<string>()
    const validCharacters = selectedCharacters.filter((id) => id !== -1)

    validCharacters.forEach((charId) => {
      const charSkillMap = data.charSkillMap?.[charId.toString()]
      if (!charSkillMap) return

      if (charSkillMap.skills && Array.isArray(charSkillMap.skills)) {
        charSkillMap.skills.forEach((skillId: number) => {
          const skill = data.skills[skillId.toString()]
          if (skill && skill.cardID) cardSet.add(skill.cardID.toString())
        })
      }

      if (charSkillMap.relatedSkills && Array.isArray(charSkillMap.relatedSkills)) {
        charSkillMap.relatedSkills.forEach((skillId: number) => {
          const skill = data.skills[skillId.toString()]
          if (skill && skill.cardID) cardSet.add(skill.cardID.toString())
        })
      }

      if (charSkillMap.notFromCharacters && Array.isArray(charSkillMap.notFromCharacters)) {
        charSkillMap.notFromCharacters.forEach((skillId: number) => {
          const skill = data.skills[skillId.toString()]
          if (skill && skill.cardID) cardSet.add(skill.cardID.toString())
        })
      }
    })

    validCharacters.forEach((charId, slotIndex) => {
      const charEquipment = equipment[slotIndex]

      const processEquipment = (equipId: string | null) => {
        if (!equipId) return
        const itemSkillMap = data.itemSkillMap?.[equipId]
        if (!itemSkillMap || !itemSkillMap.relatedSkills) return

        itemSkillMap.relatedSkills.forEach((skillId: number) => {
          const skill = data.skills[skillId.toString()]
          if (skill && skill.cardID) cardSet.add(skill.cardID.toString())
        })
      }

      if (charEquipment.weapon) processEquipment(charEquipment.weapon)
      if (charEquipment.armor) processEquipment(charEquipment.armor)
      if (charEquipment.accessory) processEquipment(charEquipment.accessory)
    })

    selectedCards.forEach((card) => {
      cardSet.add(card.id)
    })

    return Array.from(cardSet)
      .map((id) => {
        const card = data.cards[id]
        if (!card) return null

        const extraInfo: CardExtraInfo = {
          name: card.name || `card_name_${id}`,
          desc: "",
          cost: 0,
          amount: 0,
          img_url: undefined,
        }

        if (data.images && data.images[`card_${id}`]) {
          extraInfo.img_url = data.images[`card_${id}`]
        }

        let skillId = -1
        let skillObj: any = null
        for (const sId in data.skills) {
          const skill = data.skills[sId]
          if (skill && skill.cardID && skill.cardID.toString() === id) {
            extraInfo.name = t(skill.name)
            extraInfo.desc = skill.description || ""
            skillId = Number.parseInt(sId)
            skillObj = skill
            if (data.images && data.images[`skill_${sId}`]) {
              extraInfo.img_url = data.images[`skill_${sId}`]
            }
            break
          }
        }

        if (skillObj) {
          // 翻訳キーをそのまま保存（表示時に処理）
          extraInfo.desc = extraInfo.desc || ""
          extraInfo.skillObj = skillObj // スキルオブジェクトを保持
        } else {
          extraInfo.desc = extraInfo.desc || ""
        }

        if (card.cost_SN !== undefined) {
          const costValue = card.cost_SN > 0 ? Math.floor(card.cost_SN / 10000) : 0
          extraInfo.cost = costValue
        }

        if (skillId !== -1) {
          for (const charId of validCharacters) {
            const character = data.characters[charId.toString()]
            if (character && character.skillList) {
              const skillItem = character.skillList.find((item) => item.skillId === skillId)
              if (skillItem && skillItem.num) {
                extraInfo.amount = skillItem.num
                break
              }
            }
          }
        }

        const selectedCard = selectedCards.find((sc) => sc.id === id)
        const cardForImage = selectedCard || card
        const characterImage = findCharacterImageForCard(cardForImage)

        return { card, cardForImage, extraInfo, characterImage }
      })
      .filter(Boolean) as AvailableCard[]
  }, [data, selectedCharacters, selectedCards, equipment, t, processSkillDescription, findCharacterImageForCard])

  const handleImport = useCallback(async () => {
    try {
      const result = await importPreset()
      showToast(t(result.message), result.success ? "success" : "error")
      removeCurrentDeckId()

      const characterIds = selectedCharacters.filter((id) => id !== -1)
      logEventWrapper("deck_imported", {
        character_ids: JSON.stringify(characterIds),
        language: locale,
      })
    } catch (err) {
      console.error("Import error:", err)
      showToast(t("import_failed"), "error")
    }
  }, [importPreset, showToast, selectedCharacters, locale, t])

  const handleExport = useCallback(() => {
    try {
      const result = exportPreset()
      showToast(t(result.message), result.success ? "success" : "error")

      const characterIds = selectedCharacters.filter((id) => id !== -1)
      logEventWrapper("deck_exported", {
        character_ids: JSON.stringify(characterIds),
        language: locale,
      })
    } catch (err) {
      console.error("Export error:", err)
      showToast(t("export_failed"), "error")
    }
  }, [exportPreset, showToast, selectedCharacters, locale, t])

  const handleShare = useCallback(() => {
    try {
      const result = createShareableUrl()
      if (result.success && result.url) {
        navigator.clipboard.writeText(result.url)
        showToast(t("share_link_copied_alert"), "success")

        const characterIds = selectedCharacters.filter((id) => id !== -1)
        logEventWrapper("deck_shared", {
          character_ids: JSON.stringify(characterIds),
          language: locale,
        })
      } else {
        showToast(t("share_link_failed"), "error")
      }
    } catch (err) {
      console.error("Share error:", err)
      showToast(t("share_link_failed"), "error")
    }
  }, [createShareableUrl, showToast, selectedCharacters, locale, t])

  const handleClear = useCallback(() => {
    clearAll()
    removeCurrentDeckId()
    showToast(t("deck_cleared"), "success")
  }, [clearAll, showToast, t])

  const handleAwakeningSelect = useCallback(
    (characterId: number, stage: number | null) => {
      updateAwakening(characterId, stage)
    },
    [updateAwakening],
  )

  const handleOpenSaveModal = useCallback(() => setShowSaveModal(true), [])
  const handleCloseSaveModal = useCallback(() => setShowSaveModal(false), [])
  const handleOpenLoadModal = useCallback(() => setShowLoadModal(true), [])
  const handleCloseLoadModal = useCallback(() => setShowLoadModal(false), [])

  const handleSaveSuccess = useCallback(
    (deckId: string) => {
      showToast(t("deck_saved"), "success")
      setCurrentDeckId(deckId)

      const characterIds = selectedCharacters.filter((id) => id !== -1)
      logEventWrapper("deck_saved", {
        character_ids: JSON.stringify(characterIds),
        language: locale,
      })
    },
    [showToast, selectedCharacters, locale, t],
  )

  const handleLoadDeck = useCallback(
    (deck: SavedDeck) => {
      try {
        const result = importPresetObject(deck.preset)
        if (result.success) {
          setCurrentDeckId(deck.id)
          showToast(t("deck_loaded") || "Deck loaded successfully!", "success")

          const characterIds = selectedCharacters.filter((id) => id !== -1)
          logEventWrapper("deck_loaded", {
            character_ids: JSON.stringify(characterIds),
            language: locale,
          })
        } else {
          showToast(t("deck_load_error") || "Failed to load deck", "error")
        }
      } catch (err) {
        console.error("Error loading deck:", err)
        showToast(t("deck_load_error") || "Failed to load deck", "error")
      }
    },
    [importPresetObject, showToast, selectedCharacters, locale, t],
  )

  const handleDeleteDeck = useCallback(
    (deckId: string) => {
      showToast(t("deck_deleted"), "success")
      if (getCurrentDeckId() === deckId) {
        removeCurrentDeckId()
      }
    },
    [showToast, t],
  )

  const getCharacterName = useCallback(
    (characterId: number): string => {
      if (!data || characterId === -1) return ""
      const character = data.characters[characterId.toString()]
      if (!character) return ""
      return t(character.name)
    },
    [data, t],
  )

  const handleShareSavedDeck = useCallback(
    (deck: SavedDeck) => {
      try {
        // 저장된 덱을 임포트하여 현재 상태로 설정
        importPresetObject(deck.preset)
        
        // 현재 프리셋으로 공유 URL 생성
        const result = createShareableUrl()
        if (result.success && result.url) {
          navigator.clipboard.writeText(result.url)
          showToast(t("share_link_copied_alert"), "success")

          const characterIds = deck.preset.roleList.filter((id) => id !== -1)
          logEventWrapper("deck_shared", {
            deck_name: deck.name,
            character_ids: JSON.stringify(characterIds),
            language: locale,
          })
        } else {
          showToast(t("share_link_failed"), "error")
        }
      } catch (err) {
        console.error("Share error:", err)
        showToast(t("share_link_failed"), "error")
      }
    },
    [createShareableUrl, showToast, locale, t],
  )

  const handleSortCharacters = useCallback(() => {
    if (!data || !data.characters) return

    const validCharacters = selectedCharacters
      .filter((id) => id !== -1)
      .map((id) => {
        const character = data.characters[id.toString()]
        return {
          id,
          line: character?.line || 999,
          subLine: character?.subLine || 0,
        }
      })

    validCharacters.sort((a, b) => {
      if (a.line !== b.line) return a.line - b.line
      return b.subLine - a.subLine
    })

    const newSelectedCharacters = Array(5).fill(-1)
    validCharacters.forEach((char, index) => {
      const slotIndex = 4 - index
      if (slotIndex >= 0) newSelectedCharacters[slotIndex] = char.id
    })

    setSelectedCharacters(newSelectedCharacters)

    if (leaderCharacter !== -1 && !newSelectedCharacters.includes(leaderCharacter)) {
      const firstValidChar = newSelectedCharacters.find((id) => id !== -1)
      if (firstValidChar !== undefined) {
        setLeaderCharacter(firstValidChar)
      } else {
        setLeaderCharacter(-1)
      }
    }

    showToast(t("characters_sorted") || "Characters sorted by position", "success")
  }, [data, selectedCharacters, leaderCharacter, setSelectedCharacters, setLeaderCharacter, showToast, t])

  return {
    t,
    locale,
    ToastContainer,
    contentRef,
    data,
    loading,
    error,
    isLocalLoading,
    availableCards,
    selectedCharacters,
    leaderCharacter,
    selectedCards,
    battleSettings,
    equipment,
    awakening,
    getCharacter,
    getCard,
    getCardInfo,
    getEquipment,
    getSkill,
    allEquipments,
    addCharacter,
    removeCharacter,
    setLeader,
    addCard,
    removeCard,
    reorderCards,
    updateCardSettings,
    updateBattleSettings,
    updateEquipment,
    handleAwakeningSelect,
    clearAll,
    exportPreset,
    importPresetObject,
    createShareableUrl,
    decodePresetString,
    importPreset,
    createPresetObject,
    setSelectedCharacters,
    setLeaderCharacter,
    showSaveModal,
    showLoadModal,
    handleImport,
    handleExport,
    handleShare,
    handleClear,
    handleOpenSaveModal,
    handleCloseSaveModal,
    handleOpenLoadModal,
    handleCloseLoadModal,
    handleSaveSuccess,
    handleLoadDeck,
    handleDeleteDeck,
    handleShareSavedDeck,
    getCharacterName,
    handleSortCharacters,
  }
}