# Copilot Instructions: Resonance Deck Builder

## このドキュメントについて

- この文書は GitHub Copilot Coding Agent が本リポジトリで安全かつ正確に開発タスクを実施するための実務ガイドです。
- 現行コードベース（Next.js 16 / TypeScript / Tailwind v4 / next-intl）に沿った運用ルールを補足しています。
- 新しい機能を実装する際はここで示す技術選定・設計方針・モジュール構成を前提にしてください。
- 不確かな点がある場合は、リポジトリのファイルを探索し、ユーザーに「こういうことですか?」と確認をするようにしてください。

## 前提条件

- 回答は必ず日本語でしてください。
- コードの変更をする際、変更量が200行を超える可能性が高い場合は、事前に「この指示では変更量が200行を超える可能性がありますが、実行しますか?」とユーザーに確認をとるようにしてください。
- 何か大きい変更を加える場合、まず何をするのか計画を立てた上で、ユーザーに「このような計画で進めようと思います。」と提案してください。この時、ユーザーから計画の修正を求められた場合は計画を修正して、再提案をしてください。

## コマンド

パッケージマネージャーは **pnpm**、Node.js は **v24** を使用。

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm lint         # ESLint（Next.js 組み込み）
pnpm test         # Vitest（ウォッチモード）
pnpm coverage     # カバレッジレポート生成（80% 閾値）
```

単一テストファイルの実行:
```bash
pnpm test -- tests/unit/utils/myFile.test.ts
```

テストファイルの配置先: `tests/` または `lib/**/*.test.ts`（`tests/**/*.spec.ts` は除外）

## 概要
Resonance Deck Builderは、キャラクターやカード、装備などを組み合わせてデッキを構築し、バトル設定やデッキ統計を確認できるWebアプリケーションです。Next.js、TypeScript、Tailwind CSSを使用し、多言語対応（日本語・英語・中国語・韓国語）を実装しています。

## 主な機能
- デッキビルダー：キャラクター、カード、装備の選択・編集
- バトル設定：バトル条件やパラメータの調整
- デッキ統計：デッキのステータスや効果の可視化
- スクリーンショット・フォトモード
- コメントセクション：ユーザー同士の意見交換
- 多言語切替（Language Selector）
- モーダルUIによる詳細表示
- トースト通知、ローディング画面

## ディレクトリ構成
- `app/`：Next.jsのルーティング、ページ、API、グローバルCSS
- `components/`：UIコンポーネント、モーダル、UIパーツ
- `hooks/`：カスタムフック（デッキビルダー用ロジック等）
- `lib/`：Firebase設定、ユーティリティ
- `public/`：多言語ごとの画像・データベース（JSON）
- `styles/`：グローバルCSS
- `types/`：型定義
- `utils/`：ユーティリティ関数

## 技術スタック
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Firebase（設定のみ）
- React Context/Custom Hooks

## アーキテクチャ指針

### コンポーネント設計

- **Atomic Design の部分的採用**: `/components/ui` に基本コンポーネント、`/components` 内に機能特化コンポーネント
- **Composition Pattern**: 小さなコンポーネントを組み合わせて複雑な UI を構築
- **Container/Presentational Pattern**: ロジックと表示を分離 (hooks でロジックを抽出)

## ディレクトリ・ファイル命名規則

### コンポーネント

- **ファイル名**: PascalCase (例: `TaskList.tsx`, `TaskCard.tsx`)
- **ディレクトリ**: ケバブケース (例: `task-list/`, `calendar-view/`)
- **index.ts**: 各ディレクトリに配置し、外部へのエクスポートを集約

### フック

- **ファイル名**: camelCase + `use` プレフィックス (例: `useTaskList.ts`, `useAuth.ts`)

### ユーティリティ

- **ファイル名**: camelCase (例: `formatDate.ts`, `validateEmail.ts`)

### 型定義

- **ファイル名**: camelCase または PascalCase (例: `task.types.ts`, `Task.ts`)
- **型名**: PascalCase (例: `Task`, `User`, `ApiResponse<T>`)

## UI 実装ガイド

### コンポーネント設計原則

- **Single Responsibility**: 1つのコンポーネントは1つの責務のみ
- **Props の型定義**: 全ての props に明示的な型を定義
- **デフォルトエクスポートを避ける**: Named export を使用し、リファクタリングを容易に
- **children パターン**: 柔軟性が必要な場合は `children` を活用

### スタイリング

- **Tailwind CSS をベースに使用**: ユーティリティファーストのアプローチ
- **共通スタイルの定義**: `styles/globals.css` でカスタムユーティリティクラスを定義
- **CSS Modules**: コンポーネント固有の複雑なスタイルが必要な場合のみ使用
- **レスポンシブ対応**: Tailwind のブレークポイント (`sm:`, `md:`, `lg:`) を活用

### アクセシビリティ (a11y)

- **セマンティック HTML**: 適切な HTML タグを使用 (`<button>`, `<nav>`, `<main>` 等)
- **aria 属性**: 必要に応じて `aria-label`, `aria-describedby` 等を付与
- **キーボード操作**: すべての操作をキーボードで実行可能に
- **フォーカス管理**: `focus-visible` で適切なフォーカススタイルを適用

### パフォーマンス最適化

- **React.memo**: 不要な再レンダリングを防ぐ
- **useMemo / useCallback**: 高コストな計算や関数の再生成を防ぐ
- **Code Splitting**: React.lazy + Suspense で遅延ロード
- **画像最適化**: WebP 形式、適切なサイズ、lazy loading

## コーディング規約・ベストプラクティス

### TypeScript の作法

- **strict モード**: `tsconfig.json` で `strict: true`
- **any の禁止**: `no-explicit-any` ルールを有効化
- **型推論の活用**: 冗長な型注釈は避け、推論に任せる
- **ユニオン型**: 状態を明示的に表現 (例: `type Status = 'idle' | 'loading' | 'success' | 'error'`)

### React の作法

- **関数コンポーネント**: クラスコンポーネントは使用しない
- **hooks のルール**: トップレベルでのみ呼び出し、条件分岐内で呼び出さない
- **useEffect の依存配列**: 正確に指定し、不要な再実行を防ぐ
- **key prop**: リストレンダリング時に一意で安定した key を使用

### 非同期処理

- **async/await**: Promise チェーンよりも優先
- **エラーハンドリング**: try-catch で必ずエラーをキャッチ
- **AbortController**: 不要なリクエストはキャンセル

### インポート順序

1. React 関連
2. 外部ライブラリ
3. 内部モジュール (features, shared, lib)
4. 型定義
5. スタイル

```typescript
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TaskList } from '@/features/task/components';
import { Button } from '@/components/ui';
import { formatDate } from '@/utils';

import type { Task } from '@/features/task/types';

import styles from './Home.module.css';
```

### コメント

- **JSDoc**: 複雑な関数には JSDoc コメントを付与
- **TODO コメント**: 一時的な実装には `// TODO:` を残す
- **コメントアウト**: 不要なコードは削除し、コメントアウトは残さない

## アーキテクチャの重要ポイント

### データアーキテクチャ

ゲームデータ（キャラクター・カード・スキル・装備等）は **JSON ファイルではなく TypeScript の静的オブジェクト** として `lib/` 配下に格納されている。

```
lib/charDb.ts       → キャラクターマスターデータ
lib/cardDb.ts       → カードマスターデータ
lib/skillDb.ts      → スキルマスターデータ
lib/equipDb.ts      → 装備マスターデータ
lib/imgDb.ts        → 画像URLマッピング
lib/charSkillMap.ts → キャラクターとスキルの関係マップ
```

これらのデータは `hooks/use-data-loader.ts` の `useDataLoader()` フックで組み立てられ、`Database` 型として提供される。開発中は `USE_DUMMY = true` フラグでダミーデータ（`dummy/` ディレクトリ）に切り替え可能。

### `_SN` サフィックス（スケーリング数値）

キャラクターのステータス（`hp_SN`, `atk_SN`, `def_SN` 等）は **実際の値を 1,000,000 倍した整数** として格納されている。表示時は 1,000,000 で割ること。

### 多言語対応（next-intl）

- サポートロケール: `en`, `ko`, `jp`, `cn`, `tw`（デフォルト: `jp`）
- ルーティング: `app/[locale]/` 配下にページが存在し、全ロケールで静的生成される
- UI 文言は `messages/{locale}.json` に格納（`next-intl` 経由で参照）
- キャラクター名等のゲームデータの文言はキー文字列（例: `"char.10000004.name"`）として格納され、`messages/` の JSON で解決される

### デッキコードのエンコード/デコード

デッキの共有は `utils/presetCodec.ts` で実装。`pako` ライブラリを使った deflateRaw 圧縮 → base64 エンコードの形式で URL パラメータに格納される。

### デッキビルダーのロジック分割

`hooks/deck-builder/` 内で機能ごとにフックが分割されている:
- `use-characters.ts` / `use-cards.ts` / `use-equipment.ts` など各エンティティ操作
- `useDeckBuilderPage.tsx` が全フックを統合して `DeckBuilderContext` を提供
- 型定義は `hooks/deck-builder/types.ts` に集約（`types/index.ts` のグローバル型とは別）

### Firebase

`lib/firebase-config.ts` で設定済み。現在はコメントセクション（Firestore）のみ使用。

## 注意事項

- UI部品は`components/ui/`に集約
- デッキビルダーのロジックは`hooks/deck-builder/`に分割
- 型定義は`types/index.ts`（グローバル）と`hooks/deck-builder/types.ts`（ローカル）の2か所がある
- `next.config.mjs` では `typescript.ignoreBuildErrors: true` が設定されているが、型安全性は維持すること

---
このファイルはGitHub Copilotや開発者向けのガイドラインです。
