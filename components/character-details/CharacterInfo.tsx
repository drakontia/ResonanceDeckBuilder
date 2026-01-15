import type { Character } from "../../types"
import type React from "react"
import { useTranslations } from "next-intl"

interface CharacterInfoProps {
  character: Character
  getRarityColor: (rarity: string) => string
  renderSkill: (index: number, labelKey: string, defaultLabel: string) => React.ReactNode
}

export function CharacterInfo({ character, getRarityColor, renderSkill }: CharacterInfoProps) {
  const t = useTranslations()
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Character Image and Description */}
      <div className="w-full md:w-1/3">
        <div className="aspect-[3/4] max-w-[200px] mx-auto md:max-w-none bg-black rounded-lg overflow-hidden neon-border">
          {character.img_card && (
            <img
              src={character.img_card || "/placeholder.svg"}
              alt={t(character.name)}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="mt-2 text-center">
          <div className="text-lg font-bold flex items-center justify-center">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full text-white mr-2 ${getRarityColor(character.rarity || "")}`}
            >
              {character.rarity}
            </span>
            <span className="neon-text">{t(character.name)}</span>
          </div>
        </div>

        {/* Character Description */}
        <div className="mt-4 character-detail-section">
          <h3 className="character-detail-section-title">{t("character.description") || "Description"}</h3>
          <p className="text-gray-300">{character.desc ? t(character.desc) : ""}</p>
        </div>
      </div>

      {/* Character Skills */}
      <div className="w-full md:w-2/3">
        <div className="character-detail-section">
          <h3 className="character-detail-section-title">{t("character.skills") || "Skills"}</h3>
          <div className="space-y-3">
            {renderSkill(0, "skill.normal_1", "Skill 1")}
            {renderSkill(1, "skill.normal_2", "Skill 2")}
            {renderSkill(2, "skill.ultimate", "Ultimate")}
          </div>
        </div>
      </div>
    </div>
  )
}
