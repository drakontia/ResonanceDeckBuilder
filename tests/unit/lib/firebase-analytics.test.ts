import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// firebase/analytics をモック
const mockLogEvent = vi.fn()
const mockGetAnalytics = vi.fn(() => ({ name: "mock-analytics" }))
let mockApp: { name: string } | null = { name: "mock-app" }
let mockHasFirebaseConfig = true

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({ name: "mock-app" })),
}))

vi.mock("firebase/analytics", () => ({
  getAnalytics: mockGetAnalytics,
  logEvent: mockLogEvent,
}))

vi.mock("@/lib/firebase-app", () => ({
  get app() {
    return mockApp
  },
  get hasFirebaseConfig() {
    return mockHasFirebaseConfig
  },
}))

describe("firebase-analytics", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    mockLogEvent.mockClear()
    mockGetAnalytics.mockClear()
    mockApp = { name: "mock-app" }
    mockHasFirebaseConfig = true
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("logEventWrapper - development mode", () => {
    it("コンソールにログを出力し、analytics.logEvent を呼ばない", async () => {
      process.env.NODE_ENV = "development"
      process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED = "false"

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      const { logEventWrapper } = await import("@/lib/firebase-analytics")
      logEventWrapper("test_event", { key: "value" })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[DEV] Firebase Analytics Events: test_event"),
        { key: "value" },
      )
      expect(mockLogEvent).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it("イベントパラメータなしでも動作する", async () => {
      process.env.NODE_ENV = "development"
      process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED = "false"

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      const { logEventWrapper } = await import("@/lib/firebase-analytics")
      logEventWrapper("page_view")

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[DEV] Firebase Analytics Events: page_view"),
        undefined,
      )

      consoleSpy.mockRestore()
    })
  })

  describe("logEventWrapper - production mode (analytics disabled)", () => {
    it("NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED=false のとき logEvent を呼ばない", async () => {
      process.env.NODE_ENV = "production"
      process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED = "false"

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      const { logEventWrapper } = await import("@/lib/firebase-analytics")
      logEventWrapper("test_event")

      expect(mockLogEvent).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe("logEventWrapper - production mode (analytics enabled)", () => {
    it("window が存在し analytics が有効なとき logEvent を呼ぶ", async () => {
      process.env.NODE_ENV = "production"
      process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED = "true"

      // analytics インスタンスをモジュール内で参照させるため、モックを設定
      const fakeAnalytics = { name: "analytics" }
      mockGetAnalytics.mockReturnValue(fakeAnalytics)

      const { logEventWrapper } = await import("@/lib/firebase-analytics")
      logEventWrapper("test_event", { param: "val" })

      // window が jsdom 環境で存在するため、logEvent が呼ばれるか確認
      // analytics が null でない場合のみ呼ばれる
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.anything(),
        "test_event",
        { param: "val" },
      )
    })

    it("logEvent が例外を投げても握りつぶしてエラーログを出す", async () => {
      process.env.NODE_ENV = "production"
      process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED = "true"

      mockLogEvent.mockImplementationOnce(() => {
        throw new Error("analytics error")
      })

      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const { logEventWrapper } = await import("@/lib/firebase-analytics")
      expect(() => logEventWrapper("fail_event")).not.toThrow()
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR] Failed to log event: fail_event"),
        expect.any(Error),
      )

      errorSpy.mockRestore()
    })

    it("analytics が使えないときは warning と debug ログを出す", async () => {
      process.env.NODE_ENV = "production"
      process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED = "true"
      mockApp = null
      mockHasFirebaseConfig = false

      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

      const { logEventWrapper } = await import("@/lib/firebase-analytics")
      logEventWrapper("test_event", { param: "value" })

      expect(mockLogEvent).not.toHaveBeenCalled()
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[WARN] Analytics not available. Event: test_event"),
        { param: "value" },
      )
      expect(logSpy).toHaveBeenCalledWith(
        "[DEBUG] isProd: true, isAnalyticsEnabled: true, hasFirebaseConfig: false",
      )

      warnSpy.mockRestore()
      logSpy.mockRestore()
    })
  })
})
