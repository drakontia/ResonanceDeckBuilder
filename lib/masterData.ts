import { breakthroughs } from "@/lib/breakDb"
import { cards } from "@/lib/cardDb"
import { characters } from "@/lib/charDb"
import { charSkillMap } from "@/lib/charSkillMap"
import { equipments } from "@/lib/equipDb"
import { homeSkills } from "@/lib/homeSkillDb"
import { images } from "@/lib/imgDb"
import { itemSkillMap } from "@/lib/itemSkillMap"
import { skills } from "@/lib/skillDb"
import { talents } from "@/lib/talentDb"
import type { Database } from "@/types"

const qualityToRarity: Record<string, string> = {
  oneStar: "N-",
  twoStar: "N",
  threeStar: "R",
  fourStar: "SR",
  FiveStar: "SSR",
  SixStar: "UR",
}

/**
 * マスターデータを組み立て Database オブジェクトを返す。
 * サーバー側でのみ実行すること（クライアントバンドルに含めないこと）。
 */
export function buildDatabase(): Database {
  // Deep copy して元データを汚染しない
  const builtCharacters = Object.fromEntries(
    Object.entries(characters).map(([id, char]) => [id, { ...char }]),
  )
  const builtEquipments = Object.fromEntries(
    Object.entries(equipments).map(([id, equip]) => [id, { ...equip }]),
  )

  // キャラクターへの画像URL付与・rarity マッピング・desc フォールバック
  Object.keys(builtCharacters).forEach((charId) => {
    const char = builtCharacters[charId]

    const charImgKey = `char_${charId}`
    if (images[charImgKey]) {
      char.img_card = images[charImgKey]
    }

    char.rarity = qualityToRarity[char.quality] || "N-"
    char.desc = char.identity || `char_desc_${charId}`
  })

  // 装備タイプ判定・画像付与・skillList 正規化
  const equipmentTypes: Record<string, string> = {}

  Object.keys(builtEquipments).forEach((equipId) => {
    const equipment = builtEquipments[equipId]
    const tagId = equipment.equipTagId

    if (!equipment.type) {
      if (tagId >= 12600155 && tagId <= 12600160) {
        equipment.type = "weapon"
      } else if (tagId === 12600161) {
        equipment.type = "armor"
      } else if (tagId === 12600162) {
        equipment.type = "accessory"
      } else {
        equipment.type = "weapon"
      }
    }

    const equipImgKey = `equip_${equipId}`
    if (images[equipImgKey]) {
      equipment.url = images[equipImgKey]
    }

    if (equipment.skillList && !Array.isArray(equipment.skillList)) {
      const skillListObj = equipment.skillList as unknown as Record<string, { skillId?: number }>
      equipment.skillList = Object.keys(skillListObj).map((key) => ({
        skillId: Number(skillListObj[key].skillId ?? key),
      }))
    }
  })

  return {
    characters: builtCharacters,
    cards,
    skills,
    breakthroughs,
    talents,
    images,
    equipments: builtEquipments,
    equipmentTypes,
    homeSkills,
    charSkillMap,
    itemSkillMap,
  }
}
