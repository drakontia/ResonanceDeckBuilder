"use client"
import type { Character, Card } from "../types"
import type React from "react"
import { useState, useEffect } from "react"
import { TabModal } from "./ui/modal/TabModal"
import { homeSkills } from "@/lib/homeSkillDb"
import { useTranslations } from "next-intl"
import { processSkillDescription } from "@/utils/skill-description"
import { CharacterInfo } from "./character-details/CharacterInfo"
import { TalentsList } from "./character-details/TalentsList"
import { BreakthroughsList } from "./character-details/BreakthroughsList"

interface CharacterDetailsModalProps {
  isOpen: boolean
  onClose: (e?: React.MouseEvent) => void
  character: Character
  getCardInfo: (cardId: string) => { card: Card } | null
  getSkill?: (skillId: number) => any
  data?: any
  initialTab?: "info" | "talents" | "breakthroughs"
  selectedAwakeningStage?: number | null
  onAwakeningSelect?: (stage: number | null) => void
}

export function CharacterDetailsModal({
  isOpen,
  onClose,
  character,
  getCardInfo,
  getSkill,
  data,
  initialTab = "info",
  selectedAwakeningStage = null,
  onAwakeningSelect,
}: CharacterDetailsModalProps) {
  // 홈 스킬 데이터를 저장할 상태 추가
  const [homeSkills, setHomeSkills] = useState<any[]>([])
  const t = useTranslations()

  // 컴포넌트 마운트 시 홈 스킬 데이터 로드
  useEffect(() => {
    // 캐릭터에 homeSkillList가 있는 경우에만 처리
    if (character && character.homeSkillList && data) {
      const loadHomeSkills = async () => {
        try {
          // home_skill_db.json 데이터 로드 (이미 data에 있다면 그것을 사용)
          let homeSkillDb = data.homeSkills

          // data에 homeSkills가 없다면 API로 가져오기 시도
          if (!homeSkillDb) {
            homeSkillDb = homeSkills
          }

          // homeSkillType별로 param 값을 누적하기 위한 맵
          const accumulatedParams: Record<string, number> = {}

          // 캐릭터의 homeSkillList에서 정보 추출
          const skills = (character.homeSkillList || [])
            .map((homeSkill: any) => {
              const skillData = homeSkillDb[homeSkill.id]
              if (!skillData) return null

              // param 값이 있으면 저장
              const paramValue = homeSkill.param || skillData?.param || 0

              // homeSkillType이 있으면 누적 값 계산
              const homeSkillType = skillData.homeSkillType || homeSkill.homeSkillType || homeSkill.id

              // 이전에 같은 타입이 있었다면 누적
              if (accumulatedParams[homeSkillType] !== undefined) {
                accumulatedParams[homeSkillType] += paramValue
              } else {
                accumulatedParams[homeSkillType] = paramValue
              }

              return {
                ...homeSkill,
                ...skillData,
                paramValue,
                homeSkillType,
                accumulatedValue: accumulatedParams[homeSkillType],
              }
            })
            .filter(Boolean)

          setHomeSkills(skills)
        } catch (error) {
          console.error("Error processing home skills:", error)
        }
      }

      loadHomeSkills()
    }
  }, [character, data])

  // Function to get rarity badge color
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



  // Process homeSkill description to replace %s with param value
  const processHomeSkillDesc = (desc: string, paramValue: number) => {
    if (!desc) return desc

    // %s% 패턴을 찾아 100을 곱한 값으로 교체 (예: 0.2 -> 20%)
    let processedDesc = desc.replace(/%s%/g, () => {
      const percentValue = Math.round(paramValue * 100)
      return `${percentValue}`
    })

    // 일반 %s 패턴을 찾아 값으로 교체
    processedDesc = processedDesc.replace(/%s/g, paramValue.toString())

    return processedDesc
  }

  // Format text with color tags and other HTML tags

  // 각성 항목 선택 핸들러
  const handleAwakeningSelect = (stage: number) => {
    if (onAwakeningSelect) {
      // 이미 선택된 항목을 다시 클릭하면 선택 취소
      if (selectedAwakeningStage === stage) {
        onAwakeningSelect(null)
      } else {
        onAwakeningSelect(stage)
      }
    }
  }

  // 이미지 URL 가져오기 함수
  const getImageUrl = (type: "talent" | "break", id: number) => {
    if (!data || !data.images) return null

    const imageKey = `${type}_${id}`
    return data.images[imageKey] || null
  }

  // Helper function to render a skill
  function renderSkill(index: number, labelKey: string, defaultLabel: string) {
    if (!character.skillList || character.skillList.length <= index) {
      return (
        <div className="p-3 rounded-lg opacity-50">
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full mr-2">
                  {t(labelKey) || defaultLabel}
                </span>
                <span className="font-medium">{t("skill.not_available") || "Not Available"}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const skillItem = character.skillList[index]
    const skillId = skillItem.skillId
    const skillQuantity = skillItem.num || 0

    // 스킬 정보 직접 가져오기
    const skill = getSkill ? getSkill(skillId) : null

    if (!skill) {
      return (
        <div className="p-3 rounded-lg opacity-50">
          <div className="flex items-center">
            <div>
              <div className="flex items-center">
                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full mr-2">
                  {t(labelKey) || defaultLabel}
                </span>
                <span className="font-medium">{t("skill.not_found") || `Skill ID: ${skillId}`}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // 스킬 이미지 URL 찾기
    let skillImageUrl = null
    if (data && data.images) {
      // 스킬 ID로 이미지 찾기
      if (data.images[`skill_${skillId}`]) {
        skillImageUrl = data.images[`skill_${skillId}`]
      }
      // 카드 ID로 이미지 찾기
      else if (skill.cardID && data.images[`card_${skill.cardID}`]) {
        skillImageUrl = data.images[`card_${skill.cardID}`]
      }
    }

    // Get skill cost from card data if available
    let skillCost = 0
    if (skill.cardID) {
      const cardData = data?.cards[skill.cardID]
      if (cardData && cardData.cost_SN !== undefined) {
        skillCost = Math.floor(cardData.cost_SN / 10000)
      }
    }

    // Process skill description with #r replacement
    const processedDescription = processSkillDescription(skill, skill.description, t)

    return (
      <div className="p-3 rounded-lg">
        <div className="flex">
          {/* Skill Image */}
          <div className="w-12 h-12 bg-black rounded-md overflow-hidden mr-3 flex-shrink-0">
            {skillImageUrl ? (
              <img src={skillImageUrl || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex items-center">
              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full mr-2">
                {t(labelKey) || defaultLabel}
              </span>
              <span className="font-medium neon-text">{t(skill.name)}</span>

              {/* Add cost and quantity information */}
              <span className="ml-2 text-sm text-gray-300">
                COST : {skillCost} / {t("amount")} : {skillQuantity}
              </span>
            </div>

            {processedDescription && (
              <div className="text-sm text-gray-400 mt-1">{processedDescription}</div>
            )}

            {/* 필살기(인덱스 2)일 경우 리더 스킬 조건 표시 */}
            {index === 2 && skill.leaderCardConditionDesc && (
              <div className="text-sm mt-2" style={{ color: "#800020" }}>
                <strong>{t("leader_skill_condition")}: </strong>
                {t.rich(skill.leaderCardConditionDesc, {
                  i: (chunks) => <i>{chunks}</i>,
                  red: (chunks) => <span style={{ color: "#FF6666" }}>{chunks}</span>,
                  blue: (chunks) => <span style={{ color: "#7AB2FF" }}>{chunks}</span>,
                  yellow: (chunks) => <span style={{ color: "#FFB800" }}>{chunks}</span>,
                  purple: (chunks) => <span style={{ color: "#B383FF" }}>{chunks}</span>,
                  gray: (chunks) => <span style={{ color: "#666" }}>{chunks}</span>,
                  br: () => <br />,
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const modalProps = {
    isOpen: isOpen,
    onClose: (e?: React.MouseEvent) => onClose(e),
    tabs: [
      {
        id: "info",
        label: t("character.info") || "Character & Skills",
        content: (
          <CharacterInfo
            character={character}
            getRarityColor={getRarityColor}
            renderSkill={renderSkill}
          />
        ),
      },
      {
        id: "talents",
        label: t("character.talents") || "Talents",
        content: (
          <TalentsList
            character={character}
            homeSkills={homeSkills}
            data={data}
            getImageUrl={getImageUrl}
            processHomeSkillDesc={processHomeSkillDesc}
          />
        ),
      },
      {
        id: "breakthroughs",
        label: t("character.breakthroughs") || "Breakthroughs",
        content: (
          <div className="p-4">
            <BreakthroughsList
              character={character}
              data={data}
              selectedAwakeningStage={selectedAwakeningStage}
              getImageUrl={getImageUrl}
              onAwakeningSelect={handleAwakeningSelect}
            />
          </div>
        ),
      },
    ],
  }

  return (
    <TabModal
      {...modalProps}
      initialTabId={initialTab}
      footer={
        <div className="flex justify-end">
          <button onClick={() => onClose()} className="neon-button px-4 py-2 rounded-lg text-sm">
            Close
          </button>
        </div>
      }
      maxWidth="max-w-2xl"
      closeOnOutsideClick={true} // 외부 클릭으로 닫히지 않도록 설정
    />
  )
}
