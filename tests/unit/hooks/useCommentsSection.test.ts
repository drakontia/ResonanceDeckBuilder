/** @vitest-environment jsdom */
import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Firebase Firestore をモック
const mockGetDocs = vi.fn()
const mockAddDoc = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockCollection = vi.fn()
const mockDoc = vi.fn()
const mockQuery = vi.fn()
const mockOrderBy = vi.fn()
const mockLimit = vi.fn()
const mockStartAfter = vi.fn()
const mockServerTimestamp = vi.fn(() => ({ toDate: () => new Date() }))

vi.mock("firebase/firestore", () => ({
  addDoc: mockAddDoc,
  collection: mockCollection,
  serverTimestamp: mockServerTimestamp,
  query: mockQuery,
  orderBy: mockOrderBy,
  doc: mockDoc,
  deleteDoc: mockDeleteDoc,
  updateDoc: mockUpdateDoc,
  limit: mockLimit,
  startAfter: mockStartAfter,
  getDocs: mockGetDocs,
}))

vi.mock("@/lib/firebase-firestore", () => ({
  db: {},
}))

// uuid モック
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid-1234"),
}))

// next-intl モック
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}))

// useCommentsSection を動的インポートするためのヘルパー
async function importHook() {
  const { useCommentsSection } = await import("@/hooks/deck-builder/useCommentsSection")
  return useCommentsSection
}

function makeSnapshot(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  const snapDocs = docs.map((d) => ({
    id: d.id,
    data: () => d.data,
  }))
  return {
    empty: docs.length === 0,
    docs: snapDocs,
  }
}

describe("useCommentsSection", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.useRealTimers()
    localStorage.clear()

    mockCollection.mockReturnValue("collection-ref")
    mockDoc.mockReturnValue("doc-ref")
    mockQuery.mockReturnValue("query-ref")
    mockOrderBy.mockReturnValue("orderby-ref")
    mockLimit.mockReturnValue("limit-ref")
    mockStartAfter.mockReturnValue("startafter-ref")
    mockAddDoc.mockResolvedValue({ id: "new-comment-id" })
    mockUpdateDoc.mockResolvedValue(undefined)
    mockDeleteDoc.mockResolvedValue(undefined)
    mockGetDocs.mockResolvedValue(makeSnapshot([]))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("初期化", () => {
    it("localStorage に userId がない場合、新しい UUID を生成して保存する", async () => {
      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => {
        expect(result.current.userId).toBe("test-uuid-1234")
      })
      expect(localStorage.getItem("anonymousUserId")).toBe("test-uuid-1234")
    })

    it("localStorage に userId がある場合、それを使う", async () => {
      localStorage.setItem("anonymousUserId", "existing-user-id")
      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => {
        expect(result.current.userId).toBe("existing-user-id")
      })
    })

    it("初期状態でコメントリストが空である", async () => {
      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      expect(result.current.comments).toHaveLength(0)
    })
  })

  describe("コメント読み込み", () => {
    it("初期ロードでコメントを取得する", async () => {
      const createdAt = { toDate: () => new Date("2025-01-01") }
      mockGetDocs.mockResolvedValueOnce(
        makeSnapshot([
          { id: "c1", data: { content: "Hello", userId: "user-1", createdAt } },
          { id: "c2", data: { content: "World", userId: "user-2", createdAt } },
        ]),
      )

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => {
        expect(result.current.comments).toHaveLength(2)
      })
      expect(result.current.comments[0].content).toBe("Hello")
      expect(result.current.comments[1].content).toBe("World")
    })

    it("コメントが5件未満の場合、hasMore が false になる", async () => {
      mockGetDocs.mockResolvedValueOnce(makeSnapshot([{ id: "c1", data: { content: "Hi", userId: "u1", createdAt: { toDate: () => new Date() } } }]))

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      expect(result.current.hasMore).toBe(false)
    })

    it("追加読み込み時に lastVisible を使って次のページを取得する", async () => {
      const createdAt = { toDate: () => new Date("2025-01-01") }
      mockGetDocs
        .mockResolvedValueOnce(
          makeSnapshot([
            { id: "c1", data: { content: "1", userId: "u1", createdAt } },
            { id: "c2", data: { content: "2", userId: "u2", createdAt } },
            { id: "c3", data: { content: "3", userId: "u3", createdAt } },
            { id: "c4", data: { content: "4", userId: "u4", createdAt } },
            { id: "c5", data: { content: "5", userId: "u5", createdAt } },
          ]),
        )
        .mockResolvedValueOnce(makeSnapshot([{ id: "c6", data: { content: "6", userId: "u6", createdAt } }]))

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => {
        expect(result.current.comments).toHaveLength(5)
      })

      await act(async () => {
        result.current.loadMoreComments()
      })

      await waitFor(() => {
        expect(result.current.comments).toHaveLength(6)
      })
      expect(mockStartAfter).toHaveBeenCalled()
    })

    it("IntersectionObserver で追加読み込みを開始し、アンマウント時に解除する", async () => {
      const createdAt = { toDate: () => new Date("2025-01-01") }
      mockGetDocs
        .mockResolvedValueOnce(
          makeSnapshot([
            { id: "c1", data: { content: "1", userId: "u1", createdAt } },
            { id: "c2", data: { content: "2", userId: "u2", createdAt } },
            { id: "c3", data: { content: "3", userId: "u3", createdAt } },
            { id: "c4", data: { content: "4", userId: "u4", createdAt } },
            { id: "c5", data: { content: "5", userId: "u5", createdAt } },
          ]),
        )
        .mockResolvedValueOnce(makeSnapshot([{ id: "c6", data: { content: "6", userId: "u6", createdAt } }]))

      const observe = vi.fn()
      const disconnect = vi.fn()
      let observerCallback: IntersectionObserverCallback | null = null
      const originalObserver = globalThis.IntersectionObserver

      class MockIntersectionObserver implements IntersectionObserver {
        readonly root = null
        readonly rootMargin = ""
        readonly thresholds = []

        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback
        }

        disconnect = disconnect
        observe = observe
        takeRecords = () => []
        unobserve = vi.fn()
      }

      globalThis.IntersectionObserver = MockIntersectionObserver

      try {
        const useCommentsSection = await importHook()
        const { result, unmount } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

        const sentinel = document.createElement("div")
        act(() => {
          result.current.loadMoreRef.current = sentinel
        })

        await waitFor(() => {
          expect(result.current.comments).toHaveLength(5)
        })
        expect(observe).toHaveBeenCalledWith(sentinel)

        await act(async () => {
          observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
        })

        await waitFor(() => {
          expect(result.current.comments).toHaveLength(6)
        })

        unmount()
        expect(disconnect).toHaveBeenCalled()
      } finally {
        globalThis.IntersectionObserver = originalObserver
      }
    })
  })

  describe("コメント追加", () => {
    it("新しいコメントを追加するとローカル状態に反映される", async () => {
      mockGetDocs.mockResolvedValue(makeSnapshot([]))

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => expect(result.current.loading).toBe(false))

      act(() => {
        result.current.setNewComment("新しいコメント")
      })

      await act(async () => {
        await result.current.addComment()
      })

      expect(mockAddDoc).toHaveBeenCalledWith(
        "collection-ref",
        expect.objectContaining({ content: "新しいコメント" }),
      )
      expect(result.current.comments[0].content).toBe("新しいコメント")
      expect(result.current.newComment).toBe("")
    })

    it("空のコメントは送信しない", async () => {
      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => expect(result.current.loading).toBe(false))

      await act(async () => {
        await result.current.addComment()
      })

      expect(mockAddDoc).not.toHaveBeenCalled()
    })

    it("コメント送信後にクールダウンが設定される", async () => {
      mockGetDocs.mockResolvedValue(makeSnapshot([]))

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => expect(result.current.loading).toBe(false))

      act(() => result.current.setNewComment("テスト"))
      await act(async () => { await result.current.addComment() })

      expect(result.current.canComment).toBe(false)
      expect(localStorage.getItem("lastCommentTime")).not.toBeNull()
    })

    it("保存済みの lastCommentTime から残り時間を復元し、時間経過で解除する", async () => {
      vi.useFakeTimers()
      const now = new Date("2025-01-01T00:01:00.000Z")
      vi.setSystemTime(now)
      localStorage.setItem("lastCommentTime", String(now.getTime() - 5_000))

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await act(async () => {
        await Promise.resolve()
      })
      expect(result.current.remainingTime).toBe(55)
      expect(result.current.canComment).toBe(false)

      await act(async () => {
        await vi.advanceTimersByTimeAsync(55_000)
      })

      expect(result.current.remainingTime).toBe(0)
      expect(result.current.canComment).toBe(true)
    })
  })

  describe("コメント削除", () => {
    it("コメントを削除するとリストから取り除かれる", async () => {
      const createdAt = { toDate: () => new Date() }
      mockGetDocs.mockResolvedValueOnce(
        makeSnapshot([{ id: "c1", data: { content: "削除対象", userId: "u1", createdAt } }]),
      )

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => expect(result.current.comments).toHaveLength(1))

      await act(async () => {
        await result.current.deleteComment("c1")
      })

      expect(mockDeleteDoc).toHaveBeenCalled()
      expect(result.current.comments).toHaveLength(0)
    })
  })

  describe("コメント編集", () => {
    it("startEditing でコメントの編集モードに入る", async () => {
      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => expect(result.current.loading).toBe(false))

      const comment = { id: "c1", content: "元のテキスト", userId: "u1", date: new Date().toISOString() }

      act(() => {
        result.current.startEditing(comment)
      })

      expect(result.current.editingCommentId).toBe("c1")
      expect(result.current.editContent).toBe("元のテキスト")
    })

    it("cancelEditing で編集モードを終了する", async () => {
      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      const comment = { id: "c1", content: "テキスト", userId: "u1", date: new Date().toISOString() }
      act(() => result.current.startEditing(comment))
      act(() => result.current.cancelEditing())

      expect(result.current.editingCommentId).toBeNull()
      expect(result.current.editContent).toBe("")
    })

    it("編集中に addComment を呼ぶとコメントが更新される", async () => {
      const createdAt = { toDate: () => new Date() }
      mockGetDocs.mockResolvedValueOnce(
        makeSnapshot([{ id: "c1", data: { content: "旧テキスト", userId: "u1", createdAt } }]),
      )

      const useCommentsSection = await importHook()
      const { result } = renderHook(() => useCommentsSection({ currentLanguage: "en" }))

      await waitFor(() => expect(result.current.comments).toHaveLength(1))

      act(() => result.current.startEditing(result.current.comments[0]))
      act(() => result.current.setEditContent("新テキスト"))

      await act(async () => { await result.current.addComment() })

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        "doc-ref",
        expect.objectContaining({ content: "新テキスト" }),
      )
      expect(result.current.comments[0].content).toBe("新テキスト")
      expect(result.current.editingCommentId).toBeNull()
    })
  })
})
