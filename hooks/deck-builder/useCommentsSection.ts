import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  limit,
  startAfter,
  getDocs,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase-firestore"

interface Comment {
  id: string
  content: string
  date: string
  userId: string
  lastEdited?: string
}

interface UseCommentsSectionProps {
  currentLanguage: string
}

const COMMENTS_PER_PAGE = 5

export function useCommentsSection({ currentLanguage }: UseCommentsSectionProps) {
  // State management
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userId] = useState<string>(() => {
    if (typeof window === "undefined") return ""
    const existing = localStorage.getItem("anonymousUserId")
    if (existing) return existing
    const newId = uuidv4()
    localStorage.setItem("anonymousUserId", newId)
    return newId
  })
  const [lastCommentTime, setLastCommentTime] = useState<number | null>(() => {
    if (typeof window === "undefined") return null
    const lastTime = localStorage.getItem("lastCommentTime")
    return lastTime ? Number.parseInt(lastTime, 10) : null
  })
  const [now, setNow] = useState(() => Date.now())
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const initialLoadDoneRef = useRef(false)
  const commentsEnabled = db !== null

  // Cooldown timer management
  useEffect(() => {
    if (editingCommentId || !lastCommentTime) return
    const timerId = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timerId)
  }, [lastCommentTime, editingCommentId])

  const remainingTime = useMemo(() => {
    if (editingCommentId || !lastCommentTime) {
      return 0
    }

    const cooldownPeriod = 60 * 1000
    const elapsed = now - lastCommentTime
    if (elapsed >= cooldownPeriod) {
      return 0
    }

    return Math.ceil((cooldownPeriod - elapsed) / 1000)
  }, [editingCommentId, lastCommentTime, now])

  const canComment = editingCommentId !== null || remainingTime === 0

  // Load comments function
  const loadComments = useCallback(async (isInitialLoad = false) => {
    if (!db) {
      setHasMore(false)
      return
    }

    if (loading || (!hasMore && !isInitialLoad)) return
    setLoading(true)
    try {
      let q
      if (isInitialLoad) {
        q = query(collection(db, "comments"), orderBy("createdAt", "desc"), limit(COMMENTS_PER_PAGE))
      } else {
        if (!lastVisible) return
        q = query(
          collection(db, "comments"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(COMMENTS_PER_PAGE),
        )
      }

      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        setHasMore(false)
        return
      }
      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1]
      setLastVisible(lastVisibleDoc)
      const newComments = snapshot.docs.map((doc) => {
        const d = doc.data()
        return {
          id: doc.id,
          content: d.content,
          date: d.createdAt?.toDate()?.toISOString() ?? "",
          userId: d.userId,
          lastEdited: d.lastEdited?.toDate()?.toISOString(),
        }
      })
      if (isInitialLoad) setComments(newComments)
      else setComments((prev) => [...prev, ...newComments])
      setHasMore(snapshot.docs.length === COMMENTS_PER_PAGE)
    } catch (err) {
      console.error("Error loading comments:", err)
    } finally {
      setLoading(false)
    }
  }, [hasMore, lastVisible, loading])

  const loadMoreComments = useCallback(() => {
    if (!loading && hasMore) {
      void loadComments()
    }
  }, [hasMore, loadComments, loading])

  // Load initial comments
  useEffect(() => {
    if (initialLoadDoneRef.current) return
    initialLoadDoneRef.current = true
    void loadComments(true)
  }, [loadComments])

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMoreComments()
      },
      { threshold: 0.5 },
    )
    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasMore, loadMoreComments, loading])

  // Add or edit comment
  const addComment = async () => {
    if (!db) return

    if (editingCommentId) {
      if (!editContent.trim()) return
      try {
        const ref = doc(db, "comments", editingCommentId)
        await updateDoc(ref, {
          content: editContent.trim(),
          lastEdited: serverTimestamp(),
        })
        setComments((prev) =>
          prev.map((c) =>
            c.id === editingCommentId ? { ...c, content: editContent.trim(), lastEdited: new Date().toISOString() } : c,
          ),
        )
        setEditingCommentId(null)
        setEditContent("")
      } catch (err) {
        console.error("Error updating comment:", err)
      }
      return
    }

    if (!newComment.trim() || !canComment) return
    try {
      await addDoc(collection(db, "comments"), {
        content: newComment.trim(),
        userId,
        createdAt: serverTimestamp(),
      })
      const now = Date.now()
      localStorage.setItem("lastCommentTime", now.toString())
      setLastCommentTime(now)
      setNow(now)
      setComments((prev) => [
        {
          id: "local_" + Math.random().toString(36).slice(2),
          content: newComment.trim(),
          userId,
          date: new Date().toISOString(),
        },
        ...prev,
      ])
      setNewComment("")
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  // Delete comment
  const deleteComment = async (commentId: string) => {
    if (!db) return

    try {
      await deleteDoc(doc(db, "comments", commentId))
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error("Error deleting comment:", err)
    }
  }

  // Editing functions
  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
    setNewComment("")
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  // Utility functions
  const mapToLocale = (lang: string): string => {
    const localeMap: Record<string, string> = {
      ko: "ko-KR",
      en: "en-US",
      cn: "zh-CN",
      zh: "zh-CN",
      jp: "ja-JP",
      tw: "zh-TW",
    }
    return localeMap[lang] || "en-US"
  }

  const locale = mapToLocale(currentLanguage)

  const formatDate = (s: string) => new Date(s).toLocaleString(locale)
  const formatRemainingTime = (sec: number) => `${sec}s`

  return {
    // State
    comments,
    newComment,
    setNewComment,
    userId,
    remainingTime,
    canComment,
    editingCommentId,
    editContent,
    setEditContent,
    loading,
    hasMore,
    loadMoreRef,
    commentsEnabled,

    // Functions
    addComment,
    deleteComment,
    startEditing,
    cancelEditing,
    loadMoreComments,
    formatDate,
    formatRemainingTime,
  }
}
