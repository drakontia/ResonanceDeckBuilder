---
name: resonance-deck-builder-patterns
description: Coding patterns and workflows extracted from ResonanceDeckBuilder git history
version: 1.0.0
source: local-git-analysis
analyzed_commits: 200
---

# ResonanceDeckBuilder Patterns

## Commit Conventions

このプロジェクトは **Conventional Commits** と日本語メッセージを混在させて使用:

- `feat:` — 新機能・新キャラ・新装備の追加
- `fix:` — バグ修正・データ誤り訂正
- `chore:` — ビルド設定・依存関係の更新
- `refactor:` — リファクタリング

英語 prefix + 日本語説明のスタイルも許容される（例: `feat: 新キャラクターを追加する`）

## Branch Naming

| Prefix | 用途 |
|--------|------|
| `feature/` | 新機能・新キャラ追加 |
| `fix/` | バグ修正 |
| `copilot/` | GitHub Copilot が自動生成したブランチ |

## Key Workflows

### 新キャラクター追加

以下のファイルを**すべて**更新すること（セットで変更される頻度が最も高い）:

```
lib/charDb.ts         ← キャラクターマスター
lib/breakDb.ts        ← 突破データ
lib/cardDb.ts         ← カードデータ
lib/charSkillMap.ts   ← キャラ↔スキルマッピング
lib/skillDb.ts        ← スキルデータ
lib/talentDb.ts       ← タレントデータ
lib/homeSkillDb.ts    ← ホームスキル（任意）
lib/imgDb.ts          ← 画像URLマッピング
messages/jp.json      ← 日本語テキスト（最低限必須）
```

### 新装備追加

```
lib/equipDb.ts         ← 装備マスター
lib/imgDb.ts           ← 画像URLマッピング
messages/cn.json       ← 全ロケールを更新
messages/en.json
messages/jp.json
messages/ko.json
messages/tw.json
```

### 翻訳追加・修正

`messages/` 配下の **5ファイル全て** を常にセットで更新する:
`cn.json`, `en.json`, `jp.json`, `ko.json`, `tw.json`

### 画像追加

1. `public/images/{id}.png` に画像ファイルを配置
2. `lib/imgDb.ts` にキーと URL を追加

## Architecture Summary

```
lib/                  ← 静的 TypeScript ゲームデータ（JSONではない）
messages/             ← next-intl 翻訳ファイル（5ロケール）
hooks/deck-builder/   ← デッキビルダーロジック（フック分割）
components/           ← UI コンポーネント
utils/presetCodec.ts  ← デッキコードエンコード（pako圧縮 + base64）
```

## Statistics

- 分析コミット数: 200
- 最頻繁変更ファイル: `lib/imgDb.ts` (20回), `messages/jp.json` (19回), `lib/charDb.ts` (15回)
- Conventional Commits 採用率: ~31%
- 主要変更種別: キャラ/装備追加 (40%), バグ修正 (30%), 翻訳 (20%), インフラ (10%)
