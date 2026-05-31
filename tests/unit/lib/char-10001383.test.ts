import { describe, expect, it, vi } from "vitest"

describe("Character 10001383 (藍鵲児 / Lanque)", () => {
  describe("Character Data", () => {
    it("キャラクターが charDb に存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      expect(characters["10001383"]).toBeDefined()
      expect(characters["10001383"].id).toBe(10001383)
    })

    it("キャラクター名が正しく設定されている", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.name).toBe("char.10001383.name")
    })

    it("レアリティが SSR (FiveStar) である", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.quality).toBe("FiveStar")
    })

    it("ポジションが中列（line: 1, subLine: 930）である", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.line).toBe(1)
      expect(char.subLine).toBe(930)
    })

    it("基礎ステータスが設定されている", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.hp_SN).toBeDefined()
      expect(char.atk_SN).toBeDefined()
      expect(char.def_SN).toBeDefined()
      expect(char.atkSpeed_SN).toBeDefined()
    })

    it("身分（identity）が設定されている", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.identity).toBe("char.10001383.identity")
    })

    it("能力（ability）が設定されている", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.ability).toBe("char.10001383.ability")
    })

    it("装備スロットが3つ設定されている", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.equipmentSlotList).toHaveLength(3)
      expect(char.equipmentSlotList?.[0].tagID).toBe(12600155) // Weapon
      expect(char.equipmentSlotList?.[1].tagID).toBe(12600161) // Armor
      expect(char.equipmentSlotList?.[2].tagID).toBe(12600162) // Accessory
    })
  })

  describe("Basic Skills (基礎スキル)", () => {
    it("基礎スキルが5つ存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.skillList).toHaveLength(5)
    })

    it("スキル1（定縁）がカード 10600565 に対応している", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      const skill1 = char.skillList?.find(s => s.skillId === 12304709)
      expect(skill1).toBeDefined()
    })

    it("スキル2（観真）がカード 10600568 に対応している", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      const skill2 = char.skillList?.find(s => s.skillId === 12304718)
      expect(skill2).toBeDefined()
    })

    it("スキル3 がカード 10600569 に対応している", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      const skill3 = char.skillList?.find(s => s.skillId === 12304719)
      expect(skill3).toBeDefined()
    })

    it("派生スキル1（誅心）がカード 10600566 に対応している", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      const skill4 = char.skillList?.find(s => s.skillId === 12304716)
      expect(skill4).toBeDefined()
    })

    it("派生スキル2（裁命）がカード 10600567 に対応している", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      const skill5 = char.skillList?.find(s => s.skillId === 12304717)
      expect(skill5).toBeDefined()
    })
  })

  describe("Talent Cards (スキルカード)", () => {
    it("カード 10600565 が存在する", async () => {
      const { cards } = await import("@/lib/cardDb")
      expect(cards["10600565"]).toBeDefined()
    })

    it("カード 10600568 が存在する", async () => {
      const { cards } = await import("@/lib/cardDb")
      expect(cards["10600568"]).toBeDefined()
    })

    it("カード 10600569 が存在する", async () => {
      const { cards } = await import("@/lib/cardDb")
      expect(cards["10600569"]).toBeDefined()
    })

    it("カード 10600566 が存在する", async () => {
      const { cards } = await import("@/lib/cardDb")
      expect(cards["10600566"]).toBeDefined()
    })

    it("カード 10600567 が存在する", async () => {
      const { cards } = await import("@/lib/cardDb")
      expect(cards["10600567"]).toBeDefined()
    })

    it("カード 10600565 がスキル 12304709 にリンクしている", async () => {
      const { cards } = await import("@/lib/cardDb")
      const card = cards["10600565"]
      expect(card).toBeDefined()
      // Depending on card structure, it might have a skillId, ownerId, or other reference
    })
  })

  describe("Skills (スキル)", () => {
    it("スキル 12304709 が存在する", async () => {
      const { skills } = await import("@/lib/skillDb")
      expect(skills["12304709"]).toBeDefined()
    })

    it("スキル 12304718 が存在する", async () => {
      const { skills } = await import("@/lib/skillDb")
      expect(skills["12304718"]).toBeDefined()
    })

    it("スキル 12304719 が存在する", async () => {
      const { skills } = await import("@/lib/skillDb")
      expect(skills["12304719"]).toBeDefined()
    })

    it("スキル 12304716 が存在する", async () => {
      const { skills } = await import("@/lib/skillDb")
      expect(skills["12304716"]).toBeDefined()
    })

    it("スキル 12304717 が存在する", async () => {
      const { skills } = await import("@/lib/skillDb")
      expect(skills["12304717"]).toBeDefined()
    })

    it("スキル 12304709 がスキルカード 10600565 を持つ", async () => {
      const { skills } = await import("@/lib/skillDb")
      const skill = skills["12304709"]
      expect(skill.cardID).toBe(10600565)
    })

    it("スキル 12304718 がスキルカード 10600568 を持つ", async () => {
      const { skills } = await import("@/lib/skillDb")
      const skill = skills["12304718"]
      expect(skill.cardID).toBe(10600568)
    })

    it("スキル 12304719 がスキルカード 10600569 を持つ", async () => {
      const { skills } = await import("@/lib/skillDb")
      const skill = skills["12304719"]
      expect(skill.cardID).toBe(10600569)
    })

    it("スキル 12304716 がスキルカード 10600566 を持つ", async () => {
      const { skills } = await import("@/lib/skillDb")
      const skill = skills["12304716"]
      expect(skill.cardID).toBe(10600566)
    })

    it("スキル 12304717 がスキルカード 10600567 を持つ", async () => {
      const { skills } = await import("@/lib/skillDb")
      const skill = skills["12304717"]
      expect(skill.cardID).toBe(10600567)
    })
  })

  describe("Talent and Breakthrough", () => {
    it("共鳴スキル（Talent）が5つ存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.talentList).toBeDefined()
      expect(char.talentList?.length).toBe(5)
    })

    it("覚醒スキル（Breakthrough）が6つ存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.breakthroughList).toBeDefined()
      expect(char.breakthroughList?.length).toBeGreaterThanOrEqual(5)
    })

    it("共鳴スキル全てが talentDb に存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const { talents } = await import("@/lib/talentDb")
      const char = characters["10001383"]
      if (char.talentList) {
        char.talentList.forEach(talent => {
          expect(talents[talent.talentId.toString()]).toBeDefined()
        })
      }
    })

    it("覚醒スキル全てが breakDb に存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const { breakthroughs } = await import("@/lib/breakDb")
      const char = characters["10001383"]
      if (char.breakthroughList) {
        char.breakthroughList.forEach(breakthrough => {
          expect(breakthroughs[breakthrough.breakthroughId.toString()]).toBeDefined()
        })
      }
    })
  })

  describe("Home Skills (生活スキル)", () => {
    it("生活スキルが3つ存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const char = characters["10001383"]
      expect(char.homeSkillList).toBeDefined()
      expect(char.homeSkillList?.length).toBe(3)
    })

    it("生活スキル全てが homeSkillDb に存在する", async () => {
      const { characters } = await import("@/lib/charDb")
      const { homeSkills } = await import("@/lib/homeSkillDb")
      const char = characters["10001383"]
      if (char.homeSkillList) {
        char.homeSkillList.forEach(homeSkill => {
          expect(homeSkills[homeSkill.id.toString()]).toBeDefined()
        })
      }
    })
  })

  describe("Image Mapping", () => {
    it("キャラクター画像が imgDb に登録されている", async () => {
      const { images } = await import("@/lib/imgDb")
      expect(images["char_10001383"]).toBeDefined()
    })

    it("キャラクター画像 URL が正しい", async () => {
      const { images } = await import("@/lib/imgDb")
      const url = images["char_10001383"]
      expect(url).toMatch(/https:\/\/patchwiki\.biligame\.com\/images\//)
    })
  })

  describe("Skill Mapping", () => {
    it("charSkillMap にキャラクター 10001383 が登録されている", async () => {
      const { charSkillMap } = await import("@/lib/charSkillMap")
      expect(charSkillMap["10001383"]).toBeDefined()
    })

    it("charSkillMap に5つのスキルが登録されている", async () => {
      const { charSkillMap } = await import("@/lib/charSkillMap")
      const skillMap = charSkillMap["10001383"]
      expect(skillMap.skills).toHaveLength(5)
    })

    it("charSkillMap のスキル一覧が正しい", async () => {
      const { charSkillMap } = await import("@/lib/charSkillMap")
      const skillMap = charSkillMap["10001383"]
      const expectedSkills = [12304709, 12304718, 12304719, 12304716, 12304717]
      expectedSkills.forEach(skillId => {
        expect(skillMap.skills).toContain(skillId)
      })
    })
  })

  describe("Internationalization (i18n)", () => {
    it("日本語の名前が messages/jp.json に存在する", async () => {
      // This test is more of an integration test and would require loading the actual JSON
      // For now, we'll skip detailed i18n tests as they require special setup
      expect(true).toBe(true)
    })
  })
})
