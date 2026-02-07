/** @vitest-environment jsdom */
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { CardsByColor } from "@/components/deck-stats/CardsByColor"
import { ColorDistributionChart } from "@/components/deck-stats/ColorDistributionChart"
import { StatusEffectsDisplay } from "@/components/deck-stats/StatusEffectsDisplay"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock("recharts", () => ({
  __esModule: true,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  Cell: ({ fill }: { fill: string }) => <div data-testid="cell" data-fill={fill} />,
}))

describe("deck stats components", () => {
  it("renders cards by color list", () => {
    render(
      <CardsByColor
        colorDistribution={[
          {
            name: "Red",
            translatedName: "Red",
            count: 2,
            orderIndex: 0,
            cards: [{ name: "Strike", quantity: 2, characterName: "Hero" }],
          },
        ]}
        colorMap={{ Red: "#f00", Unknown: "#000" }}
      />,
    )

    expect(screen.getByText("cards_by_color")).toBeTruthy()
    expect(screen.getByText("Red (2)")).toBeTruthy()
    expect(screen.getByText("Strike")).toBeTruthy()
    expect(screen.getByText("(2)")).toBeTruthy()
    expect(screen.getByText("- Hero")).toBeTruthy()
  })

  it("renders color distribution chart cells", () => {
    render(
      <ColorDistributionChart
        colorDistribution={[
          { name: "Red", translatedName: "Red", count: 1, orderIndex: 0, cards: [] },
          { name: "Blue", translatedName: "Blue", count: 1, orderIndex: 1, cards: [] },
        ]}
        colorMap={{ Red: "#f00", Unknown: "#000" }}
      />,
    )

    const cells = screen.getAllByTestId("cell")
    expect(cells[0].getAttribute("data-fill")).toBe("#f00")
    expect(cells[1].getAttribute("data-fill")).toBe("#000")
  })

  it("hides derived effects when disabled", () => {
    render(
      <StatusEffectsDisplay
        includeDerivedCards={false}
        statusEffects={[
          { id: 1, name: "Effect A", description: "A", color: "#f00" },
          { id: 2, name: "Effect B", description: "B", color: "#0f0", source: "derived" },
        ]}
      />,
    )

    const effectA = screen.getAllByText("Effect A")[0]
    expect(effectA).toBeTruthy()
    const derived = screen.getAllByText("Effect B")[0].parentElement
    expect(derived?.classList.contains("hidden")).toBe(true)
  })

  it("shows empty state when no effects", () => {
    render(<StatusEffectsDisplay includeDerivedCards statusEffects={[]} />)

    expect(screen.getByText("no_status_effects")).toBeTruthy()
  })
})
