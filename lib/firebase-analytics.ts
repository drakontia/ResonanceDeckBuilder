import { getAnalytics, logEvent } from "firebase/analytics"
import { app } from "./firebase-app"

export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

const isProd = process.env.NODE_ENV === "production"
const isAnalyticsEnabled = process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED === "true"

export const logEventWrapper = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (!isProd || !isAnalyticsEnabled) {
    console.log(`[DEV] Firebase Analytics Events: ${eventName}`, eventParams)
    return
  }

  if (typeof window !== "undefined" && analytics) {
    try {
      logEvent(analytics, eventName, eventParams)
    } catch (error) {
      console.error(`[ERROR] Failed to log event: ${eventName}`, error)
    }
  } else {
    console.warn(`[WARN] Analytics not available. Event: ${eventName}`, eventParams)
    console.log(`[DEBUG] isProd: ${isProd}, isAnalyticsEnabled: ${isAnalyticsEnabled}`)
  }
}
