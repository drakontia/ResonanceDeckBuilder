"use client"

import { useLocale, useTranslations } from "next-intl"
import { Flag } from "lucide-react"
import type { Card, CardExtraInfo } from "../types"
import { charSkillMap } from "../lib/charSkillMap"

interface SkillCardProps {
  card: Card
  extraInfo: CardExtraInfo
  onRemove: () => void
  onEdit: () => void
  isDisabled: boolean
  characterImage?: string
  useType: number // 추가: 카드 사용 조건 타입
  useParam: number // 추가: 카드 사용 조건 파라미터
  leaderCharacter?: number
}

export function SkillCard({
  card,
  extraInfo,
  onEdit,
  isDisabled,
  characterImage,
  useType,
  useParam,
  leaderCharacter,
}: SkillCardProps) {
  const locale = useLocale()
  const t = useTranslations()

  const getLeaderDescription = () => {
    if (!leaderKey || leaderKey === "skill.leaderCardConditionDesc") return ""

    try {
      return String(
        t.rich(leaderKey, {
          i: (chunks) => <i>{chunks}</i>,
          red: (chunks) => <span style={{ color: "#FF6666" }}>{chunks}</span>,
          blue: (chunks) => <span style={{ color: "#7AB2FF" }}>{chunks}</span>,
          yellow: (chunks) => <span style={{ color: "#FFB800" }}>{chunks}</span>,
          purple: (chunks) => <span style={{ color: "#B383FF" }}>{chunks}</span>,
          gray: (chunks) => <span style={{ color: "#666" }}>{chunks}</span>,
          br: () => <br />,
        }),
      ).trim()
    } catch {
      return ""
    }
  }
  
  // リーダースキル判定1: 翻訳結果がキーと異なるかチェック
  const leaderKey = extraInfo.skillObj?.leaderCardConditionDesc
  const leaderDesc = getLeaderDescription()
  const isLeaderOwner = leaderCharacter !== undefined && leaderCharacter !== null && card.ownerId === leaderCharacter
  const hasLeaderTranslation = Boolean(
    leaderKey &&
    leaderDesc.length > 0 &&
    leaderDesc !== leaderKey &&
    isLeaderOwner,
  )
  
  // リーダースキル判定2: charSkillMapのskills配列に含まれているかチェック
  const isInSkillMap = Boolean(
    isLeaderOwner &&
    card.ownerId &&
    extraInfo.skillObj?.id &&
    charSkillMap[card.ownerId]?.skills?.includes(extraInfo.skillObj.id)
  )
  
  // 両方の条件でリーダースキルと判定
  const isLeaderSkill = hasLeaderTranslation && isInSkillMap

  // 사용 조건 텍스트 가져오기

  const shouldShowParam = () => {
    if (useType < 3 || !card.ExCondList) return false

    const condListLength = card.ExCondList.length

    // useType이 ExCondList 범위에 있는지 확인
    if (useType >= 3 && useType < 3 + condListLength) {
      const condIndex = useType - 3
      const cond = card.ExCondList[condIndex]
      // isNumCond가 true인지 확인
      return cond.isNumCond === true
    }

    return false
  }


  const getConditionText = () => {
    if (useType === 2) {
      return t("do_not_use") || "Do Not Use"
    }

    if (useType >= 3) {
      // ExCondList 범위에 속하는지 확인
      const condListLength = card.ExCondList?.length || 0

      if (card.ExCondList && useType >= 3 && useType < 3 + condListLength) {
        const condIndex = useType - 3
        const cond = card.ExCondList[condIndex]
        // card-settings-modal.tsx에서는 text_${cond.des} 형식으로 키를 생성
        const textKey = `text_${cond.des}`
        return t(textKey) || textKey
      }

      // ExActList에서 값 가져오기
      if (card.ExActList && useType >= 3 + condListLength) {
        const actIndex = useType - 3 - condListLength
        if (actIndex >= 0 && actIndex < card.ExActList.length) {
          const act = card.ExActList[actIndex]
          // card-settings-modal.tsx에서는 text_${act.des} 형식으로 키를 생성
          const textKey = `text_${act.des}`
          return t(textKey) || textKey
        }
      }
    }

    return ""
  }

  return (
    <div
      className="skill-card relative overflow-hidden h-full cursor-pointer user-select-none"
      style={{
        aspectRatio: "1/1.5",
        maxWidth: "100%",
        width: "100%",
      }}
      onClick={(e) => {
        e.stopPropagation()
        onEdit()
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* Card background */}
      <div className="absolute inset-0 w-full h-full">
        {
          <img
            src={characterImage || `${locale}/images/placeHolderCard.jpg`}
            alt=""
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              e.currentTarget.src = `${locale}/images/placeHolderCard.jpg`
            }}
          />
        }
      </div>

      {/* Card overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Leader skill Flag icon */}
      {isLeaderSkill && (
        <div className="absolute top-2 left-2 z-20">
          <Flag className="w-5 h-5 text-yellow-300 drop-shadow-lg" fill="currentColor" />
        </div>
      )}

      {/* Disabled overlay */}
      {isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-red-900/30">
          <div className="text-3xl text-red-500 transform rotate-60">🚫</div>
        </div>
      )}

      {/* Cost badge - 더 작게 만들기 */}
      <div className="absolute top-0 right-0 px-0.5 py-0 text-white font-bold sm:text-3xl text-xs z-10">
        {extraInfo.cost}
      </div>

      {/* Card content */}
      <div className="relative z-1 p-0 flex flex-col h-full">
        {/* 사용 조건 오버레이 */}
        {useType > 0 && useType !== 1 && (
          <div className="absolute top-0 left-0 w-full p-1 bg-black/50 text-white text-xs z-10 flex items-center justify-center">
            {useType === 2 ? (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1 text-red-500 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden md:inline pr-3">
                {t("do_not_use") || "Do Not Use"}
                </span>
              </span>
            ) : (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 mr-1 text-blue-500 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden md:inline pr-3">
                  {getConditionText()}
                  {shouldShowParam() ? (useParam > 0 ? `: ${useParam}` : ": 0") : ""}
                </span>
              </span>

            )}
          </div>
        )}
        {/* Empty space in the middle */}
        <div className="flex-grow"></div>

        {/* 스킬 이미지 - 크기 증가 및 위치 조정 */}
        <div className="flex justify-center mb-2 lg:mb-8 mt-auto">
          <div className="w-1/2 relative">
            {" "}
            {/* 이미지 크기를 1/4에서 1/2로 증가 */}
            <div className="aspect-square transform rotate-45 overflow-hidden bg-black/30 border border-[hsla(var(--neon-white),0.5)] shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              {extraInfo.img_url && (
                <img
                  src={extraInfo.img_url || "/placeholder.svg"}
                  alt={extraInfo.name}
                  className="object-cover absolute top-1/2 left-1/2 transform scale-150 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Card name - 두 줄까지 표시 가능하도록 수정 */}
        <div className="text-white font-bold lg:text-[1rem] text-[0.6rem] line-clamp-2 mt-auto neon-text user-select-none px-0.5 pb-0.5">
          {t(card.name)}
        </div>
      </div>
    </div>
  )
}
