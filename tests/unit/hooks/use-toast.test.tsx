/** @vitest-environment jsdom */
import React from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { reducer, toast, useToast } from "../../../hooks/use-toast"

describe("use-toast hook", () => {
  it("reducer handles add/update/remove", () => {
    const baseState = { toasts: [] as any[] }
    const toastItem = { id: "1", open: true }

    const added = reducer(baseState, { type: "ADD_TOAST", toast: toastItem })
    expect(added.toasts).toHaveLength(1)

    const updated = reducer(added, { type: "UPDATE_TOAST", toast: { id: "1", title: "Hi" } })
    expect(updated.toasts[0].title).toBe("Hi")

    const dismissed = reducer(updated, { type: "DISMISS_TOAST", toastId: "1" })
    expect(dismissed.toasts[0].open).toBe(false)

    const removed = reducer(dismissed, { type: "REMOVE_TOAST", toastId: "1" })
    expect(removed.toasts).toHaveLength(0)
  })

  it("exposes toast state and dismiss", async () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: "Hello" })
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.toasts).toHaveLength(1)

    const toastId = result.current.toasts[0].id

    act(() => {
      result.current.dismiss(toastId)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.toasts[0].open).toBe(false)
  }, 10000)
})
