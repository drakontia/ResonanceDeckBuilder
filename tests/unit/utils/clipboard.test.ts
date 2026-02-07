/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from "vitest"

import { copyToClipboard, readFromClipboard } from "../../../utils/clipboard"

describe("clipboard utils", () => {
  beforeEach(() => {
    const clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue("sample"),
    }

    Object.defineProperty(navigator, "clipboard", {
      value: clipboardMock,
      configurable: true,
    })
  })

  it("copies text to clipboard", async () => {
    await copyToClipboard("hello")

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello")
  })

  it("reads text from clipboard", async () => {
    const value = await readFromClipboard()

    expect(value).toBe("sample")
    expect(navigator.clipboard.readText).toHaveBeenCalled()
  })

  it("throws when clipboard write fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error("nope"))

    await expect(copyToClipboard("fail")).rejects.toThrow("Failed to copy to clipboard")

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("throws when clipboard read fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    navigator.clipboard.readText = vi.fn().mockRejectedValue(new Error("nope"))

    await expect(readFromClipboard()).rejects.toThrow("Failed to read from clipboard")

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
