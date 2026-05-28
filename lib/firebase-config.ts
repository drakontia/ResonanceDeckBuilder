// 後方互換性のための re-export バレル
// 新規コードは各モジュールを直接インポートしてください:
//   import { db } from "@/lib/firebase-firestore"
//   import { analytics, logEventWrapper } from "@/lib/firebase-analytics"
export { db } from "./firebase-firestore"
export { analytics, logEventWrapper } from "./firebase-analytics"
