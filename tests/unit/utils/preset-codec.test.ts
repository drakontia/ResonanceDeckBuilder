/** @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest"

import {
  decodePreset,
  decodePresetFromUrlParam,
  encodePreset,
  encodePresetForUrl,
  fixBase64FromUrl,
  padBase64,
} from "../../../utils/presetCodec"

describe("preset codec", () => {
  it("pads base64 correctly", () => {
    expect(padBase64("abcd")).toBe("abcd")
    expect(padBase64("abc")).toBe("abc=")
    expect(padBase64("ab")).toBe("ab==")
  })

  it("fixes base64 from url", () => {
    expect(fixBase64FromUrl("ab c")).toBe("ab+c")
  })

  it("encodes and decodes presets", () => {
    const payload = { a: 1, b: "text" }

    const encoded = encodePreset(payload)
    const decoded = decodePreset(encoded)

    expect(encoded).not.toBe("")
    expect(decoded).toEqual(payload)
    expect(encodePresetForUrl(payload)).toBe(encodeURIComponent(encoded))
  })

  it("returns null on invalid decode", () => {
    expect(decodePreset("not-base64")).toBeNull()
  })

  it("returns null on invalid url param", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(decodePresetFromUrlParam("%E0%A4%A")).toBeNull()
    expect(errorSpy).toHaveBeenCalled()

    errorSpy.mockRestore()
  })
})
