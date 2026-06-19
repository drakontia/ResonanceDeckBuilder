```typescript
"10001XXX": { // キャラクター名
  "id": 10001XXX,
  "name": "char.10001XXX.name",          // messages/ で解決されるキー
  "quality": "FiveStar",                  // "FiveStar" または "FourStar"
  "sideId": 12600XXX,                     // サイドキャラクターID
  "passiveSkillList": [],
  "skillList": [
    { "num": 3, "skillId": 12304XXX },    // スキルは3件。スキル1、スキル2，得意技のみを含める
    { "num": 2, "skillId": 12304XXX },
    { "num": 1, "skillId": 12304XXX }
  ],
  "tk_SN": null,
  "hp_SN": 80000000,                      // 実値 × 1,000,000
  "def_SN": 750000,
  "atk_SN": 880000,
  "atkSpeed_SN": 1000000,
  "luck_SN": 0,
  "talentList": [
    { "talentId": 12800XXX },             // 共鳴スキルは必ず5件
    { "talentId": 12800XXX },
    { "talentId": 12800XXX },
    { "talentId": 12800XXX },
    { "talentId": 12800XXX }
  ],
  "breakthroughList": [
    { "breakthroughId": 12100XXX },       // 先頭は必ず「属性なし」の基本突破
    { "breakthroughId": 12100XXX },
    { "breakthroughId": 12100XXX },
    { "breakthroughId": 12100XXX },
    { "breakthroughId": 12100XXX },
    { "breakthroughId": 12100XXX }        // 突破は必ず6件
  ],
  "line": 1,
  "subLine": 930,
  "identity": "char.10001XXX.identity",
  "ability": "char.10001XXX.ability",
  "controllerId": 10300XXX,
  "equipmentSlotList": [...],
  "homeSkillList": [...]                  // homeSkillDb.ts に対応するデータがある場合
}
```
