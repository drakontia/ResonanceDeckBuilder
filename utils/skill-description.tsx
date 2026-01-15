import type React from "react"

/**
 * スキル説明を処理して、パラメータを置換し、リッチテキストを返す
 * @param skill スキルオブジェクト
 * @param descriptionKey 翻訳キー
 * @param t useTranslations()から取得した翻訳関数
 * @returns 処理されたReact要素
 */
export function processSkillDescription(
  skill: any,
  descriptionKey: string,
  t: any
): React.ReactNode {
  if (!skill || !descriptionKey) return t(descriptionKey)

  // Build dynamic parameters object
  const params: Record<string, any> = {}

  if (skill.desParamList && skill.desParamList.length > 0) {
    skill.desParamList.forEach((param: any, index: number) => {
      const paramValue = param.param
      let rateValue: string | number = "?"

      if (skill.skillParamList && skill.skillParamList[0]) {
        const rateKey = `skillRate${paramValue}_SN`
        if (skill.skillParamList[0][rateKey] !== undefined) {
          rateValue = Math.floor(skill.skillParamList[0][rateKey] / 10000)
          if (param.isPercent) {
            rateValue = `${skill.skillParamList[0][rateKey] / 100}%`
          }
        }
      }

      params[`r${index + 1}`] = rateValue
    })
  }

  try {
    return t.rich(descriptionKey, {
      ...params,
      i: (chunks: any) => <i>{chunks}</i>,
      red: (chunks: any) => <span style={{ color: "#FF6666" }}>{chunks}</span>,
      blue: (chunks: any) => <span style={{ color: "#7AB2FF" }}>{chunks}</span>,
      yellow: (chunks: any) => <span style={{ color: "#FFB800" }}>{chunks}</span>,
      purple: (chunks: any) => <span style={{ color: "#B383FF" }}>{chunks}</span>,
      gray: (chunks: any) => <span style={{ color: "#666" }}>{chunks}</span>,
      br: () => <br />,
    })
  } catch (error) {
    console.error("Error in processSkillDescription:", error, { descriptionKey, params })
    return t(descriptionKey)
  }
}
