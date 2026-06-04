/** @vitest-environment jsdom */
import React from "react"
import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

import { formatColorText } from "../../../utils/format-text"
import { processSkillDescription } from "../../../utils/skill-description"
import type { Skill } from "@/types"

type TestTranslator = {
  (key: string): string
  rich: (key: string, params: Record<string, unknown>) => React.ReactNode
}

describe("formatColorText", () => {
  it("returns empty string for empty input", () => {
    expect(formatColorText("")).toBe("")
  })

  it("converts color tags and basic formatting", () => {
    const input = "Line1\\n<color=#FF0000>Red</color> <b>Bold</b> <i>Italic</i>"
    const html = renderToStaticMarkup(<div>{formatColorText(input)}</div>)

    expect(html).toContain("Line1")
    expect(html).toContain("Red")
    expect(html).toContain("Bold")
    expect(html).toContain("Italic")
    expect(html).toContain("span")
    expect(html).toContain("color")
    expect(html).toContain("<b>Bold</b>")
    expect(html).toContain("<i>Italic</i>")
  })
})

describe("processSkillDescription", () => {
  it("replaces params and renders rich tags", () => {
    const t = ((key: string) => `plain:${key}`) as TestTranslator
    t.rich = (key: string, params: Record<string, unknown>) => (
      <span>
        {key}|{String(params.r1)}|{String(params.r2)}
        {(params.i as (value: string) => React.ReactNode)("I")}
        {(params.red as (value: string) => React.ReactNode)("R")}
        {(params.blue as (value: string) => React.ReactNode)("B")}
        {(params.yellow as (value: string) => React.ReactNode)("Y")}
        {(params.purple as (value: string) => React.ReactNode)("P")}
        {(params.gray as (value: string) => React.ReactNode)("G")}
        {(params.br as () => React.ReactNode)()}
      </span>
    )

    const skill: Partial<Skill> = {
      desParamList: [
        { param: 1, isPercent: false },
        { param: 2, isPercent: true },
      ],
      skillParamList: [
        {
          skillRate1_SN: 25000,
          skillRate2_SN: 12345,
        },
      ],
    }

    const node = processSkillDescription(skill as Skill, "desc", t)
    const html = renderToStaticMarkup(<div>{node}</div>)

    expect(html).toContain("desc|2|123.45%")
    expect(html).toContain("<i>I</i>")
    expect(html).toContain("FF6666")
    expect(html).toContain("7AB2FF")
    expect(html).toContain("FFB800")
    expect(html).toContain("B383FF")
    expect(html).toContain("666")
    expect(html).toContain("<br/>")
  })

  it("falls back when rich translation throws", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const t = ((key: string) => `plain:${key}`) as TestTranslator
    t.rich = () => {
      throw new Error("boom")
    }

    const skill: Partial<Skill> = {
      desParamList: [{ param: 1, isPercent: false }],
      skillParamList: [{ skillRate1_SN: 10000 }],
    }

    const node = processSkillDescription(skill as Skill, "desc", t)
    const html = renderToStaticMarkup(<div>{node}</div>)

    expect(html).toContain("plain:desc")
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("returns plain translation when skill is missing", () => {
    const t = ((key: string) => `plain:${key}`) as TestTranslator
    const html = renderToStaticMarkup(<div>{processSkillDescription(null, "desc", t)}</div>)

    expect(html).toContain("plain:desc")
  })

  it("translator が渡されなくても descriptionKey をそのまま返して落ちない", () => {
    const skill: Partial<Skill> = {
      desParamList: [{ param: 1, isPercent: false }],
      skillParamList: [{ skillRate1_SN: 10000 }],
    }

    const html = renderToStaticMarkup(
      <div>{processSkillDescription(skill as Skill, "desc_without_translator", undefined as never)}</div>,
    )

    expect(html).toContain("desc_without_translator")
  })

  it("不足している r パラメータにはデフォルト値を入れて rich 変換を継続する", () => {
    const t = ((key: string) => `plain:${key}`) as TestTranslator
    t.rich = (key: string, params: Record<string, unknown>) => (
      <span>
        {key}|{String(params.r1)}|{String(params.r2)}
      </span>
    )

    const skill: Partial<Skill> = {
      desParamList: [],
      skillParamList: [],
    }

    const html = renderToStaticMarkup(<div>{processSkillDescription(skill as Skill, "desc", t)}</div>)

    expect(html).toContain("desc|?|?")
  })
})
