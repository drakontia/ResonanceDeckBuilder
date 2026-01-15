import type { Card, CardExtraInfo } from "../../types"
import { useTranslations } from "next-intl"
import { processSkillDescription } from "@/utils/skill-description"

interface CardInfoProps {
  card: Card
  extraInfo: CardExtraInfo
}

export function CardInfo({ card, extraInfo }: CardInfoProps) {
  const t = useTranslations()

  // スキル説明を取得
  const getDescription = () => {
    if (extraInfo.skillObj && extraInfo.desc) {
      return processSkillDescription(extraInfo.skillObj, extraInfo.desc, t)
    }
    return t(extraInfo.desc || "")
  }

  return (
    <div
      className="w-full md:w-3/5 p-4 md:border-r border-b md:border-b-0 border-[hsl(var(--neon-white),0.3)] overflow-y-auto"
      style={{ backgroundColor: "var(--modal-content-bg)" }}
    >
      <div className="flex mb-4">
        {/* Card Image */}
        <div className="w-24 h-24 bg-black border border-[hsl(var(--neon-white),0.3)] rounded-md overflow-hidden mr-4">
          {extraInfo.img_url && (
            <img
              src={extraInfo.img_url || "/placeholder.svg"}
              alt={extraInfo.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          {/* Card Name and Cost */}
          <div className="border-b border-[hsl(var(--neon-white),0.3)] pb-2 mb-2">
            <div className="text-xl font-bold neon-text">{t(card.name)}</div>
            <div className="flex items-center mt-1">
              <span className="text-gray-400 mr-2">{t("cost") || "Cost"}</span>
              <span className="text-[hsl(var(--neon-white))] text-2xl font-bold">{extraInfo.cost}</span>
            </div>
            {/* Only show amount if it's greater than 0 */}
            {extraInfo.amount > 0 && (
              <div className="text-sm text-gray-400">
                {t("amount") || "Amount"}: {extraInfo.amount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Description */}
      <div className="text-gray-300 mb-4">{getDescription()}</div>
    </div>
  )
}
