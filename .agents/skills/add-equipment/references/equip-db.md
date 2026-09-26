### `Equipment` データ仕様（`lib/equipDb.ts`）

```typescript
"118000XX": { // 装備名
  "id": 118000XX,
  "name": "equip.118000XX.name",           // messages/ で解決されるキー
  "des": "equip.118000XX.des",             // messages/ で解決されるキー
  "equipTagId": 12600155,                  // 装備種別ID（下表参照）
  "quality": "Orange",                     // レアリティ（下表参照）
  "skillList": [
    { "skillId": 12305XXX }                // 装備効果スキル（複数件の場合もある）
  ],
  "Getway": [
    {
      "DisplayName": "equip.118000XX.getway.0.displayName", // messages/ で解決されるキー
      "FromLevel": -1,
      "UIName": "",
      "Way3": "",
      "funcId": 4294967295
    }
  ]
}
```

---

## `quality`（レアリティ）対応表

> ⚠️ **Issue #128 の事例**: UR装備「緋雷の律」の `quality` を `"Purple"`（SR相当）と誤記した。
> 見た目の色に惑わされず、必ず下表で対応関係を確認すること。

| `quality` の値 | レアリティ | 根拠 |
|---------------|-----------|------|
| `"Orange"` | UR | `hooks/deck-builder/useCharacterSlot.ts` の `getRarityColor`/`getRarityBorderStyle` で `case "UR"` と同系色（オレンジ〜赤のグラデーション） |
| `"Golden"` | SSR | 同上 `case "SSR"`（黄〜琥珀色） |
| `"Purple"` | SR | 同上 `case "SR"`（紫〜藍色） |
| `"Blue"` | R | 同上 `case "R"`（青〜水色） |

**対策**: 装備を追加する際は、対象装備の実際のレアリティ（UR/SSR/SR/R）を先に確認し、
上表を使って正しい `quality` 文字列に変換すること。「紫っぽいからSR」のような感覚的な判断はしない。

---

## `equipTagId`（装備種別）対応表

| `equipTagId` | 種別 |
|--------------|------|
| `12600155` / `12600160` | 武器 (weapon) |
| `12600161` | 防具 (armor) |
| `12600162` | 装身具 (accessory) |

`lib/tagDb.ts` および `lib/masterData.ts` の判定ロジックと整合させること。
