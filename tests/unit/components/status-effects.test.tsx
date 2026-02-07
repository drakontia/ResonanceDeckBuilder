/** @vitest-environment jsdom */
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { StatusEffects } from "@/components/status-effects"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock("@/lib/tagDb", () => ({
  tagDb: {
    "1": { tagName: "tag.one", detail: "tag.one.detail" },
    "2": { tagName: "tag.two", detail: "tag.two.detail" },
  },
}))

vi.mock("@/lib/tagColorMapping", () => ({
  tagColorMapping: {
    "#FF0000": [1],
  },
}))

describe("StatusEffects", () => {
  it("renders status effects for active cards", () => {
    render(
      <StatusEffects
        selectedCards={[{ id: "10", useType: 1, useParam: 0 }]}
        availableCards={[
          {
            card: { id: 10, name: "card", tagList: [{ tagId: 1 }, { tagId: 2 }] },
            extraInfo: { name: "card", desc: "", cost: 0, amount: 1 },
          },
        ]}
        data={{}}
      />,
    )

    expect(screen.getByText("status_effects")).toBeTruthy()
    expect(screen.getAllByText("tag.one")[0]).toBeTruthy()
    expect(screen.queryByText("tag.two")).toBeNull()
  })

  it("shows empty state when no effects", () => {
    render(<StatusEffects selectedCards={[]} availableCards={[]} data={{}} />)

    expect(screen.getByText("no_status_effects")).toBeTruthy()
  })
})
