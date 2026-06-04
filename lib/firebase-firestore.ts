import { getFirestore } from "firebase/firestore"
import { app } from "./firebase-app"

export const db = app ? getFirestore(app) : null
