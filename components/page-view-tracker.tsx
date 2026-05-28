"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { logEventWrapper } from "@/lib/firebase-analytics"

interface PageViewTrackerProps {
  locale: string
  deckCode: string | null
}

export function PageViewTracker({ locale, deckCode }: PageViewTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (deckCode) {
      logEventWrapper("deck_shared_visit", {
        deck_code: deckCode,
        language: locale,
      })
    }

    logEventWrapper("page_view", {
      page_path: pathname,
      language: locale,
    })
  }, [pathname, locale, deckCode])

  return null
}
