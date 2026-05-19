---
name: add-character
description: 新規キャラクターを Resonance Deck Builder のデータベースに追加するための手順とベストプラクティス。更新すべきファイル一覧・各ファイルのデータ仕様・よくあるミスパターンと回避方法・追加後の確認チェックリストを網羅する。
version: 1.0.0
source: local-git-analysis
---

# 新規キャラクター追加スキル

## 概要

新規キャラクターを追加する際は、**複数のファイルをセットで更新しなければならない**。1ファイルでも漏れると、デッキビルダーでデータ不整合が発生する。

過去のPRで繰り返し発生したミスをもとに、このスキルを作成した。

---

## 更新が必要なファイル一覧

### 必須ファイル（すべて更新すること）

| ファイル | 役割 |
|---------|------|
| `lib/charDb.ts` | キャラクターのマスターデータ（ステータス・スキル・タレント・突破リスト） |
| `lib/breakDb.ts` | 突破（ブレイクスルー）データ（6件） |
| `lib/cardDb.ts` | 共鳴カードデータ |
| `lib/charSkillMap.ts` | キャラクター↔スキルのマッピング |
| `lib/skillDb.ts` | スキルデータ |
| `lib/talentDb.ts` | タレントデータ（5件） |
| `lib/imgDb.ts` | 画像URLマッピング |
| `messages/jp.json` | 日本語テキスト（最低限必須） |
| `messages/en.json` | 英語テキスト |
| `messages/ko.json` | 韓国語テキスト |
| `messages/cn.json` | 中国語（簡体字）テキスト |
| `messages/tw.json` | 中国語（繁体字）テキスト |

### 任意ファイル（データが存在する場合は必須）

| ファイル | 役割 |
|---------|------|
| `lib/homeSkillDb.ts` | ホームスキルデータ（3件・ホームスキルが存在するキャラのみ） |

---

## ステップバイステップ手順

### Step 1: キャラクターIDを確定する

追加するキャラクターのIDを確認する。IDは `10001XXX` 形式の整数。

> ⚠️ **よくあるミス（PR #36 の事例）**: IDを間違えて登録し、後から全ファイルを修正する事態が発生した。  
> **対策**: IDを最初に確定し、以降の全ファイルで必ず同じIDを使用すること。

### Step 2: `lib/charDb.ts` を更新する

キャラクターのマスターデータを追加する。

```typescript
"10001XXX": { // キャラクター名
  "id": 10001XXX,
  "name": "char.10001XXX.name",          // messages/ で解決されるキー
  "quality": "FiveStar",                  // "FiveStar" または "FourStar"
  "sideId": 12600XXX,                     // サイドキャラクターID
  "passiveSkillList": [],
  "skillList": [
    { "num": 3, "skillId": 12304XXX },    // スキルは通常3件
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
    { "talentId": 12800XXX },             // タレントは必ず5件
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

**重要な注意点:**
- `hp_SN`, `atk_SN`, `def_SN` などの `_SN` フィールドは**実際の値 × 1,000,000**の整数
- `breakthroughList` は**6件**。**先頭（index 0）は必ず属性なしの「基本突破」**（PR #50 の教訓）
- `talentList` は**必ず5件**

### Step 3: `lib/breakDb.ts` を更新する

突破（ブレイクスルー）データを6件追加する。

```typescript
// キャラクター名
"12100XXX": {                             // 1件目: 基本突破（属性なし）
  "id": 12100XXX,
  "name": "break.12100XXX.name",
  "desc": "break.12100XXX.desc",
  "attributeList": []                     // ← 先頭は必ず空配列
},
"12100XXX": {                             // 2件目以降: 属性付き
  "id": 12100XXX,
  "name": "break.12100XXX.name",
  "desc": "break.12100XXX.desc",
  "attributeList": [
    {
      "attributeType": "Atk",            // "Atk" / "Def" / "Hp" など
      "numType": "Percent",              // "Percent" または "Number"
      "num_SN": 50000                    // 実値 × 1,000,000
    }
  ]
}
// ... 計6件
```

> ⚠️ **よくあるミス（PR #50 の事例）**: `breakthroughList` の先頭に属性付きの突破を置いてしまった。  
> **対策**: 先頭は必ず `attributeList: []` の基本突破。charDb.ts の `breakthroughList[0]` のIDが `breakDb.ts` で `attributeList: []` になっていることを確認する。

### Step 4: `lib/cardDb.ts` を更新する

共鳴カードデータを追加する。

```typescript
// キャラクター名
"10600XXX": {
  "id": 10600XXX,
  "idCN": "00共鳴/05出撃/キャラ名・A",
  "name": "card.10600XXX.name",
  "color": "Red",                         // "Red" / "Blue" / "Yellow"
  "cost_SN": 30000,                       // カードコスト（実値 × 1,000,000）
  "cardType": "Normal",
  "ExCondList": [],
  "ExActList": [],
  "tagList": []
}
```

### Step 5: `lib/charSkillMap.ts` を更新する

キャラクターとスキルのマッピングを追加する。

```typescript
"10001XXX": {                             // charDb.ts と同じID
  "skills": [
    12304XXX,                             // charDb の skillList[].skillId と完全一致
    12304XXX,
    12304XXX
  ],
  "relatedSkills": [
    12304XXX                              // リーダースキルや補助スキルなど（任意）
  ],
  "notFromCharacters": []
}
```

> ⚠️ **重要**: `skills[]` の内容が `charDb.ts` の `skillList[].skillId` と**完全一致**していることを確認する。

### Step 6: `lib/skillDb.ts` を更新する

スキルデータを追加する。

```typescript
"12304XXX": {
  "id": 12304XXX,
  "name": "skill.12304XXX.name",
  "description": "skill.12304XXX.description",
  "detailDescription": "skill.12304XXX.detailDescription",
  "ExSkillList": [],
  "cardID": 10600XXX,
  "leaderCardConditionDesc": "skill.12304XXX.leaderCardConditionDesc", // ← リーダーカード条件付きスキルのみ
  "desParamList": [],
  "skillParamList": [...]
}
```

> ⚠️ **よくあるミス（PR #56 の事例）**: リーダーカード条件付きスキルで `leaderCardConditionDesc` フィールドを書き忘れた（汎用キー `"skill.leaderCardConditionDesc"` を使ってしまった）。  
> **対策**: リーダーカード条件があるスキルは必ず `"skill.{skillId}.leaderCardConditionDesc"` 形式のキーを使うこと。

### Step 7: `lib/talentDb.ts` を更新する

タレントデータを**5件**追加する。

```typescript
"12800XXX": {
  "id": 12800XXX,
  "name": "talent.12800XXX.name",
  "desc": "talent.12800XXX.desc",
  "awakeLv": 2,                           // 解放レベル（2/3/4/5）
  "skillParamOffsetList": []
}
// charDb.ts の talentList に対応する5件のみ追加すること
```

> ⚠️ **よくあるミス（PR #42 の事例）**: 別キャラクターのタレントデータ5件を誤ってコピーし、不要なデータ（ID範囲外のタレント）を `messages/jp.json` に追加してしまった。  
> **対策**: `charDb.ts` の `talentList` に含まれる**5件のみ**追加する。それ以外のタレントIDは絶対に追加しない。

### Step 8: `lib/homeSkillDb.ts` を更新する（任意）

キャラクターにホームスキルが存在する場合のみ追加する（通常3件）。

```typescript
// キャラクター名
"83900XXX": {
  "id": 83900XXX,
  "name": "home_skill.83900XXX.name",
  "desc": "home_skill.83900XXX.desc",
  "param": 0.1,
  "homeSkillType": "AddSpecQty"           // スキルタイプに応じた値
}
```

### Step 9: `lib/imgDb.ts` を更新する

画像URLマッピングを追加する。追加するキーは以下の形式：

```typescript
// キャラクター名
"char_10001XXX": "https://patchwiki.biligame.com/images/resonance/...",
"skill_12304XXX": "https://patchwiki.biligame.com/images/resonance/...",  // スキル分
"skill_12304XXX": "https://patchwiki.biligame.com/images/resonance/...",
"skill_12304XXX": "https://patchwiki.biligame.com/images/resonance/...",
"talent_12800XXX": "https://patchwiki.biligame.com/images/resonance/...", // タレント5件のみ
"talent_12800XXX": "https://patchwiki.biligame.com/images/resonance/...",
"talent_12800XXX": "https://patchwiki.biligame.com/images/resonance/...",
"talent_12800XXX": "https://patchwiki.biligame.com/images/resonance/...",
"talent_12800XXX": "https://patchwiki.biligame.com/images/resonance/...",
```

**キーの命名規則:**
- キャラクター画像: `char_{charId}`
- スキル画像: `skill_{skillId}`
- タレント画像: `talent_{talentId}`
- 突破画像: `break_{breakId}`

> ⚠️ **よくあるミス（PR #42 の事例）**: `charDb.ts` の `talentList` に含まれる5件を超えた余分なタレント画像を追加してしまった。  
> **対策**: タレント画像は `charDb.ts` の `talentList` の**5件分のみ**追加する。

### Step 10: `messages/*.json` を5言語すべて更新する

`messages/jp.json`, `messages/en.json`, `messages/ko.json`, `messages/cn.json`, `messages/tw.json` の**5ファイル全て**を必ずセットで更新する。

#### `messages/jp.json` のセクション別更新内容

**`char` セクション:**
```json
"char": {
  "10001XXX": {
    "name": "キャラクター名",
    "identity": "肩書き",
    "ability": "能力名"
  }
}
```

**`skill` セクション（スキルと突破）:**
```json
"skill": {
  "12304XXX": {
    "name": "スキル名",
    "description": "スキル説明",
    "detailDescription": "スキル詳細説明",
    "leaderCardConditionDesc": "リーダーカード条件（条件付きスキルのみ）"
  },
  "12100XXX": {
    "name": "突破名",
    "desc": "突破効果"
  }
}
```

**`talent` セクション:**
```json
"talent": {
  "12800XXX": {
    "name": "タレント名",
    "desc": "タレント効果"
  }
}
```

**`card` セクション:**
```json
"card": {
  "10600XXX": {
    "name": "カード名"
  }
}
```

**`home_skill` セクション（ホームスキルがある場合）:**
```json
"home_skill": {
  "83900XXX": {
    "name": "ホームスキル名",
    "desc": "ホームスキル効果"
  }
}
```

> ⚠️ **よくあるミス（PR #42 の事例）**: タレントデータを `talent` セクションではなく `skill` セクションに入れてしまった、または `charDb.ts` に含まれないIDのタレントを追加してしまった。  
> **対策**: 各データを正しいセクションに配置し、IDが `charDb.ts` の各リストと一致することを確認する。

---

## 追加後の確認チェックリスト

追加が完了したら、以下の項目を必ず確認すること。

### ID整合性チェック

- [ ] `charDb.ts` のキャラクターID（`"10001XXX"`）が全ファイルで一致している
  - `charDb.ts`: `"id": 10001XXX`
  - `charSkillMap.ts`: キー `"10001XXX"`
  - `imgDb.ts`: `"char_10001XXX"`
  - `messages/*.json`: `"char"."10001XXX"`
- [ ] `charDb.ts` の `skillList[].skillId` が `charSkillMap.ts` の `skills[]` と完全一致している
- [ ] `charDb.ts` の `talentList[].talentId` が `talentDb.ts` のキーと一致している（5件）
- [ ] `charDb.ts` の `breakthroughList[].breakthroughId` が `breakDb.ts` のキーと一致している（6件）

### 突破リストチェック

- [ ] `charDb.ts` の `breakthroughList[0]`（先頭）のIDが `breakDb.ts` で `"attributeList": []` である

### タレントデータチェック

- [ ] `talentDb.ts` に追加したタレントが `charDb.ts` の `talentList` の5件と対応している（余分なものを追加していない）
- [ ] `imgDb.ts` に追加したタレント画像が5件のみである（余分なものを追加していない）

### スキルデータチェック

- [ ] リーダーカード条件付きスキルの `leaderCardConditionDesc` が `"skill.{skillId}.leaderCardConditionDesc"` 形式のキーになっている（汎用キー `"skill.leaderCardConditionDesc"` を使っていない）

### メッセージファイルチェック

- [ ] `messages/` の5言語ファイル（jp / en / ko / cn / tw）全てを更新した
- [ ] 各セクション（char / skill / talent / card / home_skill）に正しいIDでデータを配置した

### ファイル漏れチェック

- [ ] `lib/charDb.ts` ✅
- [ ] `lib/breakDb.ts` ✅
- [ ] `lib/cardDb.ts` ✅
- [ ] `lib/charSkillMap.ts` ✅
- [ ] `lib/skillDb.ts` ✅
- [ ] `lib/talentDb.ts` ✅
- [ ] `lib/homeSkillDb.ts` ✅（データが存在する場合）
- [ ] `lib/imgDb.ts` ✅
- [ ] `messages/jp.json` ✅
- [ ] `messages/en.json` ✅
- [ ] `messages/ko.json` ✅
- [ ] `messages/cn.json` ✅
- [ ] `messages/tw.json` ✅

---

## よくあるミスまとめ

| ミスのパターン | 発生したPR | 影響 | 回避策 |
|--------------|-----------|------|--------|
| キャラクターIDを間違えた | PR #36 | 全ファイルで修正が必要 | IDを最初に確定し、全ファイルで統一する |
| `breakthroughList` の先頭が基本突破でない | PR #50 | 突破表示の順序異常 | 先頭要素の `attributeList` が `[]` であることを確認 |
| 不要なタレントデータをコピーした | PR #42 | 不正なデータが表示される | `charDb.ts` の `talentList` 5件のみを対象にする |
| `leaderCardConditionDesc` を書き忘れた | PR #56 | スキル条件が表示されない | リーダーカード条件付きスキルは必ずキーを追加する |
| `messages/` のファイルを一部だけ更新した | 複数PR | 他言語で表示されない | 5言語ファイルを必ずセットで更新する |

---

## データ仕様リファレンス

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
