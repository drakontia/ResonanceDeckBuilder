/** @vitest-environment jsdom */
import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"

import { DeckStats } from "@/components/deck-stats"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

let colorChartProps: any
let cardsByColorProps: any
let statusDisplayProps: any

vi.mock("@/components/deck-stats/ColorDistributionChart", () => ({
  ColorDistributionChart: (props: any) => {
    colorChartProps = props
    return <div data-testid="color-chart" />
  },
}))

vi.mock("@/components/deck-stats/CardsByColor", () => ({
  CardsByColor: (props: any) => {
    cardsByColorProps = props
    return <div data-testid="cards-by-color" />
  },
}))

vi.mock("@/components/deck-stats/StatusEffectsDisplay", () => ({
  StatusEffectsDisplay: (props: any) => {
    statusDisplayProps = props
    return <div data-testid="status-effects" />
  },
}))

describe("DeckStats", () => {
  beforeEach(() => {
    colorChartProps = null
    cardsByColorProps = null
    statusDisplayProps = null
  })

  it("builds color distribution and passes props", () => {
    const setIncludeDerivedCards = vi.fn()

    render(
      <DeckStats
        selectedCards={[
          { id: "1", useType: 1, useParam: -1, skillId: 10 },
          { id: "2", useType: 2, useParam: -1, skillId: 20 },
        ]}
        availableCards={[
          {
            card: { id: 1, name: "Card A", color: "Red", ownerId: 1 },
            extraInfo: { name: "Card A", desc: "", cost: 1, amount: 2 },
          },
          {
            card: { id: 2, name: "Card B", color: "Blue", ownerId: 2 },
            extraInfo: { name: "Card B", desc: "", cost: 1, amount: 1 },
          },
        ]}
        data={{
          characters: { "1": { name: "char.one" }, "2": { name: "char.two" } },
          charSkillMap: { "1": { skills: [10] } },
        }}
        statusEffects={[{ id: 1, name: "Effect" }]}
        includeDerivedCards={true}
        setIncludeDerivedCards={setIncludeDerivedCards}
      />,
    )

    expect(colorChartProps).toBeTruthy()
    expect(cardsByColorProps).toBeTruthy()
    expect(statusDisplayProps.statusEffects).toHaveLength(1)

    const distribution = colorChartProps.colorDistribution
    expect(distribution).toHaveLength(1)
    expect(distribution[0].name).toBe("Red")
    expect(distribution[0].translatedName).toBe("color_red")
    expect(distribution[0].count).toBe(2)

    const toggle = document.querySelector("#includeDerivedCards") as HTMLInputElement
    fireEvent.click(toggle)
    expect(setIncludeDerivedCards).toHaveBeenCalledWith(false)
  })

  it("filters derived cards when includeDerivedCards is false", () => {
    const setIncludeDerivedCards = vi.fn()

    render(
      <DeckStats
        selectedCards={[
          { id: "1", useType: 1, useParam: -1, skillId: 10 },
          { id: "2", useType: 1, useParam: -1, skillId: 99 },
        ]}
        availableCards={[
          {
            card: { id: 1, name: "Card A", color: "Red", ownerId: 1 },
            extraInfo: { name: "Card A", desc: "", cost: 1, amount: 1 },
          },
          {
            card: { id: 2, name: "Card B", color: "Blue", ownerId: 2 },
            extraInfo: { name: "Card B", desc: "", cost: 1, amount: 1 },
          },
        ]}
        data={{
          characters: { "1": { name: "char.one" } },
          charSkillMap: { "1": { skills: [10] } },
        }}
        statusEffects={[]}
        includeDerivedCards={false}
        setIncludeDerivedCards={setIncludeDerivedCards}
      />,
    )

    const distribution = colorChartProps.colorDistribution
    expect(distribution).toHaveLength(1)
    expect(distribution[0].name).toBe("Red")
  })
})
