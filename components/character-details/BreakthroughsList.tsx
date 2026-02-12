import { useTranslations } from "next-intl"
import type { Character } from "@/types"

interface BreakthroughsListProps {
  character: Character
  data: any
  selectedAwakeningStage: number | null
  getImageUrl: (type: "talent" | "break", id: number) => string | null
  onAwakeningSelect: (stage: number) => void
}

export function BreakthroughsList({
  character,
  data,
  selectedAwakeningStage,
  getImageUrl,
  onAwakeningSelect,
}: BreakthroughsListProps) {
  const t = useTranslations()
  return (
    <div className="space-y-3">
      {character.breakthroughList && character.breakthroughList.length > 0 ? (
        character.breakthroughList.slice(1).map((breakthrough, index) => {
          const breakImageUrl = getImageUrl("break", breakthrough.breakthroughId)
          const isSelected = selectedAwakeningStage === index + 1

          return (
            <div
              key={index}
              className={`p-4 bg-black/50 rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? "ring-2 ring-purple-500 bg-black/70"
                  : "hover:bg-black/70"
              }`}
              onClick={() => onAwakeningSelect(index + 1)}
            >
              <div className="flex">
                {/* 각성 이미지 또는 번호 표시 */}
                <div
                  className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center mr-3 overflow-hidden ${
                    selectedAwakeningStage !== null && index + 1 <= selectedAwakeningStage
                      ? "bg-purple-600"
                      : ""
                  }`}
                >
                  {breakImageUrl ? (
                    <img
                      src={breakImageUrl || "/placeholder.svg"}
                      alt={`Breakthrough ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">{index + 1}</span>
                  )}
                </div>

                <div className="grow">
                  <div className="flex items-center">
                    <div className="font-medium neon-text">
                      {data?.breakthroughs && data.breakthroughs[breakthrough.breakthroughId]
                        ? t(data.breakthroughs[breakthrough.breakthroughId].name)
                        : `Breakthrough ${breakthrough.breakthroughId}`}
                    </div>
                    {/* 각성 단계 표시 */}
                    <div className="ml-2 text-xs px-2 py-0.5 bg-gray-600 rounded-full text-white">
                      {"Lv."} {index + 1}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {data?.breakthroughs && data.breakthroughs[breakthrough.breakthroughId]
                      ? t.rich(data.breakthroughs[breakthrough.breakthroughId].desc, {
                          i: (chunks) => <i>{chunks}</i>,
                          red: (chunks) => <span style={{ color: "#FF6666" }}>{chunks}</span>,
                          blue: (chunks) => <span style={{ color: "#7AB2FF" }}>{chunks}</span>,
                          yellow: (chunks) => <span style={{ color: "#FFB800" }}>{chunks}</span>,
                          purple: (chunks) => <span style={{ color: "#B383FF" }}>{chunks}</span>,
                          gray: (chunks) => <span style={{ color: "#666" }}>{chunks}</span>,
                          br: () => <br />,
                        })
                      : "No description available"}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-gray-400 text-center p-4">
          {t("no_breakthroughs") || "No breakthroughs available"}
        </div>
      )}
    </div>
  )
}
