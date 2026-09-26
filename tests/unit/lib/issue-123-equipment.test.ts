import { describe, expect, it } from "vitest"

import { equipments } from "@/lib/equipDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"

describe("Issue #123 equipment data", () => {
  it("緋雷の律が武器として追加されている", () => {
    const equipment = equipments["11800402"]

    expect(equipment).toBeDefined()
    expect(equipment.id).toBe(11800402)
    expect(equipment.name).toBe("equip.11800402.name")
    expect(equipment.des).toBe("equip.11800402.des")
    expect(equipment.equipTagId).toBe(12600155)
    expect(equipment.quality).toBe("Purple")
    expect(equipment.skillList).toEqual([{ skillId: 12305056 }])
    expect(equipment.Getway).toHaveLength(1)
    expect(equipment.Getway?.[0].DisplayName).toBe("equip.11800402.getway.0.displayName")
  })

  it("緋雷の律の画像が解決できる", () => {
    expect(images["equip_11800402"]).toBe(
      "https://resonance.wikiru.jp/?plugin=attach&pcmd=open&file=%E7%B7%8B%E9%9B%B7%E3%81%AE%E5%BE%8B_t.png&refer=img"
    )
  })

  it("緋雷の律の装備効果スキルが定義されている", () => {
    const skill = skills["12305056"]

    expect(skill).toBeDefined()
    expect(skill?.id).toBe(12305056)
    expect(skill?.name).toBe("skill.12305056.name")
    expect(skill?.description).toBe("skill.12305056.description")
  })
})
