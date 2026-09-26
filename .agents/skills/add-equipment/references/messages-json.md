### `messages/{jp,en,ko,cn,tw}.json` の装備セクション更新内容

装備データに紐づくテキストは `equip` セクションに配置する。5言語ファイル全てを必ずセットで更新すること。

```json
{
  "equip": {
    "118000XX": {
      "name": "装備名",
      "des": "装備の説明文（フレーバーテキスト）",
      "getway": {
        "0": {
          "displayName": "入手方法（例: 武林源紀-交換ストア）"
        }
      }
    }
  }
}
```

- `equipDb.ts` の `name` / `des` / `Getway[].DisplayName` に指定したキー
  （`equip.{equipId}.name` など）が、この `equip` セクションのIDと完全一致していること。
- `Getway` が複数件ある場合は `getway` オブジェクトの `"0"`, `"1"`, ... に対応させる。
- 装備効果スキルの説明文（`skill.{skillId}.description` など）は `skill` セクションに配置する
  （`equip` セクションに混在させない）。
