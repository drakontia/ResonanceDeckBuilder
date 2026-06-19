### `_SN` サフィックス（スケーリング数値）

`hp_SN`, `atk_SN`, `def_SN`, `num_SN`, `cost_SN` などの `_SN` フィールドは、**実際の値を 1,000,000 倍した整数**として格納する。

| 実値 | `_SN` 値 |
|------|---------|
| 80 | 80,000,000 |
| 0.75 | 750,000 |
| 0.05 | 50,000 |
| 1.0 | 1,000,000 |

### IDパターン

| 種別 | IDレンジ（参考） | 例 |
|------|--------------|-----|
| キャラクターID | `10001XXX` | `10001314` |
| スキルID | `12304XXX` | `12304459` |
| タレントID | `12800XXX` | `12800700` |
| 突破ID | `12100XXX` | `12100987` |
| カードID | `10600XXX` | `10600541` |
| ホームスキルID | `83900XXX` | `83900287` |

### メッセージキーの形式

```
char.{charId}.name
char.{charId}.identity
char.{charId}.ability
skill.{skillId}.name
skill.{skillId}.description
skill.{skillId}.detailDescription
skill.{skillId}.leaderCardConditionDesc  ← リーダーカード条件付きのみ
talent.{talentId}.name
talent.{talentId}.desc
break.{breakId}.name
break.{breakId}.desc
card.{cardId}.name
home_skill.{homeSkillId}.name
home_skill.{homeSkillId}.desc
```
