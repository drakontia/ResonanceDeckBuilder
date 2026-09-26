### IDパターン

| 種別 | IDレンジ（参考） | 例 |
|------|--------------|-----|
| 装備ID | `118000XX` | `11800402` |
| 装備効果スキルID | `12305XXX` | `12305056` |
| 装備タグID（種別） | `126001XX` | `12600155`（武器） |

### メッセージキーの形式

```
equip.{equipId}.name
equip.{equipId}.des
equip.{equipId}.getway.{n}.displayName
skill.{skillId}.name          ← 装備効果スキルがある場合
skill.{skillId}.description   ← 装備効果スキルがある場合
```

### 関連するキャラクター側のデータ

キャラクターの `equipmentSlotList` は `lib/charDb.ts` 側で `tagID` を使って
装備可能な種別（武器/防具/装身具）を定義している。装備追加自体では
`charDb.ts` を変更する必要はないが、装備種別（`equipTagId`）を誤ると
キャラクターの装備画面で候補に表示されなくなるため、`equip-db.md` の
`equipTagId` 対応表と必ず照合すること。
