### `lib/imgDb.ts` への画像URL追加

装備の画像URLは `images` オブジェクトに `equip_{equipId}` キーで追加する。

```typescript
export const images: Record<string, string> = {
  "equip_118000XX": "https://...実際に画像が表示される直リンクURL...",
  // ...
}
```

---

## ⚠️ よくあるミス（Issue #128 の事例）

装備「緋雷の律」（`equip_11800402`）の画像URLとして、以下のような
**PukiWiki の添付ファイル表示プラグイン形式のURL** を登録してしまい、画像が表示されなかった。

```
https://resonance.wikiru.jp/?plugin=attach&pcmd=open&file=%E7%B7%8B%E9%9B%B7%E3%81%AE%E5%BE%8B_t.png&refer=img
```

この形式はwikiのページコンテキストに依存しており、`<img>` タグの `src` に直接指定しても
画像が表示されないことがある。

**対策**: 画像URLを登録する前に、必ずブラウザで直接そのURLを開いて画像が表示されることを確認する。
`resonance.wikiru.jp` の場合は `attach2/` から始まる直接表示用URL
（例: `https://resonance.wikiru.jp/attach2/{エンコードされたファイル名}.png`）を優先して使用する。

他の画像ソース（`patchwiki.biligame.com` 等）についても同様に、追加前に実URLへアクセスして
画像が正しく表示されることを目視確認すること。
