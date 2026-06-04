import { beforeEach, describe, expect, it, vi } from "vitest"

const mockInitializeApp = vi.fn(() => ({ name: "mock-app" }))

vi.mock("firebase/app", () => ({
  initializeApp: mockInitializeApp,
}))

describe("firebase-app", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    mockInitializeApp.mockClear()
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    delete process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    delete process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    delete process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    delete process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  })

  it("必須の Firebase 設定が欠けている場合は app を初期化しない", async () => {
    const { app, hasFirebaseConfig } = await import("@/lib/firebase-app")

    expect(app).toBeNull()
    expect(hasFirebaseConfig).toBe(false)
    expect(mockInitializeApp).not.toHaveBeenCalled()
  })

  it("必須の Firebase 設定が揃っている場合は app を初期化する", async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "api-key"
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "example.firebaseapp.com"
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "example-project"
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "example.appspot.com"
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "1234567890"
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "1:1234567890:web:example"
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-EXAMPLE"

    const { app, hasFirebaseConfig } = await import("@/lib/firebase-app")

    expect(app).toEqual({ name: "mock-app" })
    expect(hasFirebaseConfig).toBe(true)
    expect(mockInitializeApp).toHaveBeenCalledWith({
      apiKey: "api-key",
      authDomain: "example.firebaseapp.com",
      projectId: "example-project",
      storageBucket: "example.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:example",
      measurementId: "G-EXAMPLE",
    })
  })
})
