import { useState, useEffect, useRef } from "react"
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
import { db } from "@/lib/firebase-config"

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
  const [userId, setUserId] = useState<string>("")
  const [lastCommentTime, setLastCommentTime] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [canComment, setCanComment] = useState<boolean>(true)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initialize user ID
  useEffect(() => {
    if (typeof window === "undefined") return
    const existing = localStorage.getItem("anonymousUserId")
    if (existing) setUserId(existing)
    else {
      const newId = uuidv4()
      localStorage.setItem("anonymousUserId", newId)
      setUserId(newId)
    }
    const lastTime = localStorage.getItem("lastCommentTime")
    if (lastTime) setLastCommentTime(Number.parseInt(lastTime, 10))
  }, [])

  // Cooldown timer management
  useEffect(() => {
    if (editingCommentId) return setCanComment(true)
    if (!lastCommentTime) return setCanComment(true)
    const cooldownPeriod = 60 * 1000
    const updateTimer = () => {
      const now = Date.now()
      const elapsed = now - lastCommentTime
      if (elapsed >= cooldownPeriod) return setCanComment(true)
      setRemainingTime(Math.ceil((cooldownPeriod - elapsed) / 1000))
      setCanComment(false)
    }
    updateTimer()
    const timerId = setInterval(updateTimer, 1000)
    return () => clearInterval(timerId)
  }, [lastCommentTime, editingCommentId])

  // Load initial comments
  useEffect(() => {
    loadComments(true)
  }, [])

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
    observerRef.current = observer
    return () => observer.disconnect()
  }, [loading, hasMore])

  // Load comments function
  const loadComments = async (isInitialLoad = false) => {
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
      if (snapshot.empty) return setHasMore(false)
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
  }

  const loadMoreComments = () => {
    if (!loading && hasMore) loadComments()
  }

  // Add or edit comment
  const addComment = async () => {
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
      setCanComment(false)
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
