import { describe, expect, it } from "vitest"

import { equipments } from "@/lib/equipDb"
import { images } from "@/lib/imgDb"
import { skills } from "@/lib/skillDb"

describe("Issue #71 equipment data", () => {
  it("静影、壁に沈むが武器として追加されている", () => {
    const equipment = equipments["11800400"]

    expect(equipment).toBeDefined()
    expect(equipment.id).toBe(11800400)
    expect(equipment.name).toBe("equip.11800400.name")
    expect(equipment.equipTagId).toBe(12600155)
    expect(equipment.quality).toBe("Orange")
    expect(equipment.skillList).toEqual([{ skillId: 12304000 }])
  })

  it("玄鉄の契文が装身具として追加されている", () => {
    const equipment = equipments["11800401"]

    expect(equipment).toBeDefined()
    expect(equipment.id).toBe(11800401)
    expect(equipment.name).toBe("equip.11800401.name")
    expect(equipment.equipTagId).toBe(12600162)
    expect(equipment.quality).toBe("Orange")
    expect(equipment.skillList).toEqual([{ skillId: 12304001 }])
  })

  it("新装備2件の画像が解決できる", () => {
    expect(images["equip_11800400"]).toBe("https://patchwiki.biligame.com/images/resonance/thumb/2/20/1kn5eqyjg3qhd0tlc21esul2z915so4.png/180px-%E9%9D%99%E5%BD%B1%E6%B2%89%E7%92%A7.png")
    expect(images["equip_11800401"]).toBe("https://patchwiki.biligame.com/images/resonance/thumb/a/ad/i4n3bulw3syelt1bfcnle93fup66nr1.png/180px-%E7%8E%84%E9%93%81%E6%9C%B1%E5%A5%91.png")
  })

  it("新装備の装備効果スキルが定義されている", () => {
    expect(skills["12304000"]?.description).toBe("skill.12304000.description")
    expect(skills["12304001"]?.description).toBe("skill.12304001.description")
  })
})
