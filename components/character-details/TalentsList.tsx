import type { Character } from "../../types"
import { useTranslations } from "next-intl"

interface TalentsListProps {
  character: Character
  homeSkills: any[]
  data: any
  getImageUrl: (type: "talent" | "break", id: number) => string | null
  processHomeSkillDesc: (desc: string, value: number) => string
}

export function TalentsList({
  character,
  homeSkills,
  data,
  getImageUrl,
  processHomeSkillDesc,
}: TalentsListProps) {
  const t = useTranslations()
  if (!character.talentList || character.talentList.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4">{t("no_talents") || "No talents available"}</div>
    )
  }

  return (
    <div className="space-y-3 p-4">
      {character.talentList.map((talent, index) => {
        const talentImageUrl = getImageUrl("talent", talent.talentId)
        const relatedHomeSkills = homeSkills.filter((skill) => skill.resonanceLv === index + 1)

        return (
          <div key={`talent-${index}`} className="p-3 bg-black/50 rounded-lg">
            <div className="flex">
              {/* Talent Image */}
              <div className="w-12 h-12 shrink-0 mr-3 rounded-md overflow-hidden flex items-center justify-center">
                {talentImageUrl ? (
                  <img
                    src={talentImageUrl || "/placeholder.svg"}
                    alt={`Talent ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">{index + 1}</span>
                )}
              </div>

              <div className="grow">
                <div className="flex items-center">
                  <div className="font-medium neon-text">
                    {data?.talents && data.talents[talent.talentId]
                      ? t(data.talents[talent.talentId].name)
                      : `Talent ${talent.talentId}`}
                  </div>
                  <div className="ml-2 text-xs px-2 py-0.5 bg-gray-600 rounded-full text-white">
                    Lv. {index + 1}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {data?.talents && data.talents[talent.talentId]
                    ? t.rich(data.talents[talent.talentId].desc, {
                        i: (chunks: any) => <i>{chunks}</i>,
                        red: (chunks: any) => <span style={{ color: "#FF6666" }}>{chunks}</span>,
                        blue: (chunks: any) => <span style={{ color: "#7AB2FF" }}>{chunks}</span>,
                        yellow: (chunks: any) => <span style={{ color: "#FFB800" }}>{chunks}</span>,
                        purple: (chunks: any) => <span style={{ color: "#B383FF" }}>{chunks}</span>,
                        gray: (chunks: any) => <span style={{ color: "#666" }}>{chunks}</span>,
                        br: () => <br />,
                      })
                    : "No description available"}
                </div>

                {/* Related home skills */}
                {relatedHomeSkills.length > 0 && (
                  <div className="mt-2 border-t border-gray-700 pt-2">
                    {relatedHomeSkills.map((skill: any, skillIndex: number) => (
                      <div key={`home-skill-${skillIndex}`} className="text-xs text-gray-300 ml-2 mb-1">
                        <span className="font-medium text-white">{t(skill.name) || skill.name}:</span>{" "}
                        {processHomeSkillDesc(
                          t(skill.desc) || skill.desc,
                          skill.accumulatedValue || skill.paramValue,
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
