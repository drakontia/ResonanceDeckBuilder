# Resonance デッキビルダー (Resonance Deck Builder)

![image](https://github.com/user-attachments/assets/1d967fb9-da06-4b69-a360-d180f51a330a)<!-- 必要ならスクリーンショット画像を追加 -->

📌 Webサイト | Website: https://rsns-deck-builder.drakontia.com

---

## 🇯🇵 概要 (Japanese)

**Resonance Solstice** のデッキ構築を支援するWebアプリケーションです。  
ゲーム内でコピーしたデッキコードを貼り付けて編集したり、新しいデッキを作成してゲームに適用できます。

### 🔧 主な機能

- **デッキコードの読み込み**  
  クリップボードにコピーしたゲーム内デッキコードを読み込めます。

- **デッキコードの書き出し**  
  編集したデッキをクリップボードにコピーし、ゲームに適用できます。

- **デッキ共有**  
  作成したデッキをURLリンクで簡単に共有できます。

- **スクリーンショットボタン**  
  ボタンを押すとデッキ画面のスクリーンショットを自動保存します。

- **リセット**  
  現在作成中のデッキをすべて初期化します。初期化後は元に戻せません。

- **ローカル保存 / 読み込み**  
  ブラウザにデッキプリセットを保存し、後から読み込めます。

- **言語設定**  
  複数言語に対応しています（KO/EN/JP/CN/TW）。

---

## 🇺🇸 Introduction (English)

A web application that helps you build and manage your decks for the game **Resonance**.  
Import deck codes copied in-game, edit them on the site, and export them back into the game.

### 🔧 Key Features

- **Import from Clipboard**  
  Load a deck code copied from the game.

- **Export to Clipboard**  
  Copy your edited deck as a code usable in-game.

- **Deck Sharing via URL**  
  Share your custom deck with others using a unique URL.

- **Screenshot Button**  
  Automatically capture and save a screenshot of your deck.

- **Reset Deck**  
  Clears the current deck. This action cannot be undone.

- **Save / Load Locally**  
  Save your deck presets to your browser or load them later.

- **Language Support**  
  Supports multiple languages (Korean, English, Japanese, Simplified/Traditional Chinese).

## ⚙️ Tech Stack

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat)
![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white&style=flat)
![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwind-css&logoColor=white&style=flat)
![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white&style=flat)
![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=white&style=flat)

---

[![codecov](https://codecov.io/github/drakontia/ResonanceDeckBuilder/graph/badge.svg?token=E4EROJDG9Q)](https://codecov.io/github/drakontia/ResonanceDeckBuilder)

## 💻 開発環境

### ブランチ

- `deploy`: 本番環境  

### 実行環境

- Node.js: `24`
- パッケージマネージャー: `pnpm`

---

## 🔗 デプロイ

### Vercel

- `deploy` ブランチにコミットすると **本番環境** に自動デプロイされます。

### Firebase Firestore

- Firebase Firestore でコメントデータを管理します。

---

## 🧪 今後の予定 (TODO)

- 新キャラの追加のみを対応していく予定です。

---

## 📝 ライセンス

This project is licensed under the [GNU General Public License v3.0](./LICENSE).  
See the LICENSE file for more information.
