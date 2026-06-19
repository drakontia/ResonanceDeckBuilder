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
