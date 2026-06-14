/** @vitest-environment jsdom */
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { UsageSettings } from "@/components/card-settings/UsageSettings"
import type { Card } from "@/types"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

describe("UsageSettings", () => {
  it("renders a numeric ExActList option with a parameter control", () => {
    const card = {
      id: 1001,
      name: "card.name",
      ExCondList: [],
      ExActList: [
        { des: "after_attack" },
        { des: "specified_ally", isNumCond: true, minNum: 1, interValNum: 5, numDuration: 1 },
      ],
    } as Card

    const { container } = render(
      <UsageSettings card={card} useType={1} useParamMap={{}} onOptionSelect={() => {}} onParamChange={() => {}} />,
    )

    const options = container.querySelectorAll(".skill-option")
    const numericOption = options[3]

    expect(numericOption.textContent).toContain("text_specified_ally")
    expect(numericOption.textContent).toContain("1")
    expect(numericOption.querySelectorAll("button")).toHaveLength(2)
  })
})
