"use client"

import { useTranslations } from "next-intl"

interface StatusEffect {
  id: string
  name: string
  color: string
  description: string
  source: "normal" | "derived" | "both"
}

interface StatusEffectTagsProps {
  statusEffects: StatusEffect[]
  includeDerivedCards: boolean
  forceShowAll?: boolean
}

export function StatusEffectTags({
  statusEffects,
  includeDerivedCards,
  forceShowAll = false,
}: StatusEffectTagsProps) {
  const t = useTranslations()

  return (
    <div className="neon-container p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4 neon-text">
        {t("status_effects") || "Status Effects"}
      </h3>
      {statusEffects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {statusEffects.map((effect) => (
            <div
              key={effect.id}
              className={`relative group tooltip-group ${
                !forceShowAll && !includeDerivedCards && effect.source === "derived" ? "hidden" : ""
              }`}
              onMouseEnter={(e) => {
                const tag = e.currentTarget
                const tagRect = tag.getBoundingClientRect()
                const tooltipWidth = 256
                const screenWidth = window.innerWidth

                if (tagRect.left + tagRect.width / 2 > screenWidth / 2) {
                  tag.style.setProperty("--tooltip-x", `${Math.max(tagRect.left - tooltipWidth, 10)}px`)
                  tag.style.setProperty("--tooltip-align", "left")
                } else {
                  tag.style.setProperty("--tooltip-x", `${tagRect.right}px`)
                  tag.style.setProperty("--tooltip-align", "right")
                }

                const tooltipY = tagRect.top - 10
                tag.style.setProperty("--tooltip-y", `${tooltipY}px`)
              }}
            >
              <span
                className="px-2 py-1 bg-black/50 border rounded-md text-sm cursor-help"
                style={{
                  borderColor: effect.color,
                  color: effect.color,
                  boxShadow: `0 0 5px ${effect.color}40`,
                }}
              >
                {t(effect.name) || effect.name}
              </span>

              <div
                className="fixed p-2 rounded text-xs text-gray-300 
                          invisible group-hover:visible z-10 border border-gray-700 pointer-events-none
                          bg-black/90 shadow-lg w-64"
                style={{
                  left: "var(--tooltip-x, 0)",
                  top: "var(--tooltip-y, 0)",
                }}
              >
                <div className="font-bold mb-1" style={{ color: effect.color }}>
                  {t(effect.name) || effect.name}
                </div>
                <div>{t(effect.description) || effect.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{t("no_status_effects") || "No status effects found"}</p>
      )}
    </div>
  )
}
