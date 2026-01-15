"use client"
import type { Card, CardExtraInfo } from "../types"
import { Modal } from "./ui/modal/Modal"
import { useTranslations } from "next-intl"
import { useCardSettings } from "../hooks/deck-builder/useCardSettings"
import { CardInfo } from "./card-settings/CardInfo"
import { UsageSettings } from "./card-settings/UsageSettings"

interface CardSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card
  extraInfo: CardExtraInfo
  initialUseType: number
  initialUseParam: number
  initialUseParamMap?: Record<string, number>
  onSave: (cardId: string, useType: number, useParam: number, useParamMap?: Record<string, number>) => void
  characterImage?: string
}

// CardSettingsModal에서 selectedCard의 저장된 정보 활용
export function CardSettingsModal({
  isOpen,
  onClose,
  card,
  extraInfo,
  initialUseType,
  initialUseParam,
  initialUseParamMap = {},
  onSave,
  characterImage,
}: CardSettingsModalProps) {
  const t = useTranslations()
  const { useType, useParamMap, handleOptionSelect, handleParamChange } = useCardSettings({
    cardId: card.id.toString(),
    initialUseType,
    initialUseParam,
    initialUseParamMap,
    onSave,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 8H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className="text-lg font-bold neon-text">{t("skill_details") || "Skill Details"}</h2>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <button onClick={onClose} className="neon-button px-4 py-2 rounded-lg text-sm">
            {t("close")}
          </button>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div
        className="flex flex-col md:flex-row flex-grow overflow-hidden"
        style={{ backgroundColor: "var(--modal-content-bg)" }}
      >
        {/* Left - Card Info */}
        <CardInfo card={card} extraInfo={extraInfo} t={t} />

        {/* Right - Usage Settings */}
        <UsageSettings
          card={card}
          useType={useType}
          useParamMap={useParamMap}
          onOptionSelect={handleOptionSelect}
          onParamChange={handleParamChange}
          t={t}
        />
      </div>
    </Modal>
  )
}