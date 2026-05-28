"use client"

import { useEffect, useState } from "react"
import type { Database } from "@/types"

export function useDataLoader() {
  const [data, setData] = useState<Database | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/master-data")
        if (!res.ok) {
          throw new Error(`Failed to fetch master data: ${res.status}`)
        }
        const json: Database = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}
