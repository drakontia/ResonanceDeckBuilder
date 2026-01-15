import type { Card } from "../../types"
import type React from "react"
import { ChevronLeft, ChevronRight, PlusIcon as MoreThan, MinusIcon as LessThan, Equal } from "lucide-react"

interface UsageSettingsProps {
  card: Card
  useType: number
  useParamMap: Record<string, number>
  onOptionSelect: (type: number, param?: number) => void
  onParamChange: (optionIndex: number, newValue: number, min: number, max: number) => void
  t: (key: string) => string
}

export function UsageSettings({
  card,
  useType,
  useParamMap,
  onOptionSelect,
  onParamChange,
  t,
}: UsageSettingsProps) {
  // Icon rendering function
  const renderIcon = (iconText: string | undefined) => {
    if (!iconText) return null

    switch (iconText) {
      case "<=":
        return (
          <span className="flex items-center">
            <LessThan className="w-4 h-4 mr-1" />=
          </span>
        )
      case ">=":
        return (
          <span className="flex items-center">
            <MoreThan className="w-4 h-4 mr-1" />=
          </span>
        )
      case "<":
        return <LessThan className="w-4 h-4" />
      case ">":
        return <MoreThan className="w-4 h-4" />
      case "=":
        return <Equal className="w-4 h-4" />
      default:
        return <span>{iconText}</span>
    }
  }

  // Icon mapping for conditions
  const getIconForCondition = (typeEnum: string | undefined) => {
    if (!typeEnum) return undefined

    switch (typeEnum.toLowerCase()) {
      case "less":
        return "<"
      case "lessequal":
        return "<="
      case "greater":
        return ">"
      case "greaterequal":
        return ">="
      case "equal":
        return "="
      default:
        return undefined
    }
  }

  return (
    <div className="w-full md:w-2/5 p-4 overflow-y-auto" style={{ backgroundColor: "var(--modal-content-bg)" }}>
      <h3 className="text-lg font-medium mb-4 neon-text">{t("usage_settings") || "Usage Settings"}</h3>

      <div className="space-y-3">
        {/* Use Immediately Option */}
        <div
          className={`skill-option ${useType === 1 ? "skill-option-selected" : "skill-option-unselected"}`}
          onClick={() => onOptionSelect(1)}
        >
          <div className="font-medium">{t("use_immediately") || "Use Immediately"}</div>
        </div>

        {/* Do Not Use Option */}
        <div
          className={`skill-option ${useType === 2 ? "skill-option-selected" : "skill-option-unselected"}`}
          onClick={() => onOptionSelect(2)}
        >
          <div className="font-medium">{t("do_not_use") || "Do Not Use"}</div>
        </div>

        {/* Condition Options from ExCondList */}
        {card.ExCondList &&
          card.ExCondList.map((cond, index) => {
            // Calculate option index (starting from 3 after the default options)
            const optionIndex = index + 3
            const isNumCond = cond.isNumCond === true
            const minNum = cond.minNum || 0
            const maxNum =
              cond.interValNum && cond.numDuration ? minNum + (cond.interValNum - 1) * cond.numDuration : 100
            const step = cond.numDuration || 1

            // Calculate current value
            const currentValue =
              useParamMap[optionIndex.toString()] !== undefined ? useParamMap[optionIndex.toString()] : minNum

            // Generate language key
            const textKey = `text_${cond.des}`
            let text = t(textKey)
            let specialChar = ""
            const match = text.match(/(≥|≤|<|>)$/)
            console.log(specialChar)
            if (match) {
              specialChar = match[0]
              text = text.slice(0, -1) // Remove last character
            }

            return (
              <div
                key={`cond-${optionIndex}`}
                className={`skill-option ${useType === optionIndex ? "skill-option-selected" : "skill-option-unselected"}`}
                onClick={() => onOptionSelect(optionIndex, currentValue)}
              >
                <div className="flex items-center">
                  <div className="font-medium flex items-center">
                    {/* Text */}
                    <span>{text}</span>
                    {specialChar ? <span>{specialChar}</span> : null}
                    {/* Icon */}
                    {cond.typeEnum && <span className="mx-1">{renderIcon(getIconForCondition(cond.typeEnum))}</span>}

                    {/* Number Input (if isNumCond is true) */}
                    {isNumCond && (
                      <div className="ml-2 flex items-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="w-4 h-6 bg-black bg-opacity-20 rounded-l flex items-center justify-center"
                          onClick={() => onParamChange(optionIndex, currentValue - step, minNum, maxNum)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span
                          className={`font-mono inline-block text-right ${
                            cond.typeEnum === "percent" ? "w-[3ch]" : "w-[2ch]"
                          }`}
                        >
                          {currentValue}
                          {cond.typeEnum === "percent" ? "%" : ""}
                        </span>
                        <button
                          className="w-4 h-6 bg-black bg-opacity-20 rounded-r flex items-center justify-center"
                          onClick={() => onParamChange(optionIndex, currentValue + step, minNum, maxNum)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

        {/* Action Options from ExActList */}
        {card.ExActList &&
          card.ExActList.map((act, index) => {
            // Calculate option index (starting after ExCondList options)
            const condListLength = card.ExCondList?.length || 0
            const optionIndex = index + 3 + condListLength

            // Generate language key
            const textKey = `text_${act.des}`

            return (
              <div
                key={`act-${optionIndex}`}
                className={`skill-option ${useType === optionIndex ? "skill-option-selected" : "skill-option-unselected"}`}
                onClick={() => onOptionSelect(optionIndex)}
              >
                <div className="flex items-center">
                  <div className="font-medium flex items-center">
                    {/* Text */}
                    <span>{t(textKey) || textKey}</span>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
