import type React from "react"
import type { Skill, SkillParam } from "@/types"

type RichTextChunk = React.ReactNode
type RichTranslationValue =
  | string
  | number
  | ((chunks: RichTextChunk) => React.ReactNode)

type RichTranslator = {
  (key: string): string
  rich: (key: string, values: Record<string, RichTranslationValue>) => React.ReactNode
}

const fallbackTranslator: RichTranslator = Object.assign((key: string) => key, {
  rich: (key: string) => key,
})

/**
 * スキル説明を処理して、パラメータを置換し、リッチテキストを返す
 * @param skill スキルオブジェクト
 * @param descriptionKey 翻訳キー
 * @param t useTranslations()から取得した翻訳関数
 * @returns 処理されたReact要素
 */
export function processSkillDescription(
  skill: Skill | null | undefined,
  descriptionKey: string,
  t?: RichTranslator,
): React.ReactNode {
  const translator = t ?? fallbackTranslator

  if (!skill || !descriptionKey) return translator(descriptionKey)

  // Build dynamic parameters object
  const params: Record<string, string | number> = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [`r${index + 1}`, "?"]),
  )

  if (skill.desParamList && skill.desParamList.length > 0) {
    skill.desParamList.forEach((param, index) => {
      const paramValue = param.param
      let rateValue: string | number = "?"
      const skillParams: SkillParam | undefined = skill.skillParamList?.[0]

      if (skillParams) {
        const rateKey = `skillRate${paramValue}_SN` as keyof SkillParam
        const rawRate = skillParams[rateKey]
        if (rawRate !== undefined) {
          rateValue = Math.floor(rawRate / 10000)
          if (param.isPercent) {
            rateValue = `${rawRate / 100}%`
          }
        }
      }

      params[`r${index + 1}`] = rateValue
    })
  }

  try {
    return translator.rich(descriptionKey, {
      ...params,
      i: (chunks: RichTextChunk) => <i>{chunks}</i>,
      red: (chunks: RichTextChunk) => <span style={{ color: "#FF6666" }}>{chunks}</span>,
      blue: (chunks: RichTextChunk) => <span style={{ color: "#7AB2FF" }}>{chunks}</span>,
      yellow: (chunks: RichTextChunk) => <span style={{ color: "#FFB800" }}>{chunks}</span>,
      purple: (chunks: RichTextChunk) => <span style={{ color: "#B383FF" }}>{chunks}</span>,
      gray: (chunks: RichTextChunk) => <span style={{ color: "#666" }}>{chunks}</span>,
      br: () => <br />,
    })
  } catch (error) {
    console.error("Error in processSkillDescription:", error, { descriptionKey, params })
    return translator(descriptionKey)
  }
}
