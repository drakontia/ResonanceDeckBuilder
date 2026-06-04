/** @vitest-environment jsdom */
import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"
import type { CardExtraInfo, Database } from "@/types"

import { DeckStats } from "@/components/deck-stats"
import type { SelectedCard } from "@/hooks/deck-builder/types"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

type ColorDistributionItem = {
  name: string
  translatedName: string
  count: number
}

type ChartProps = {
  colorDistribution: ColorDistributionItem[]
  colorMap: Record<string, string>
}

type StatusDisplayProps = {
  statusEffects: Array<{ id: number | string; name: string }>
}

let colorChartProps: ChartProps | null
let cardsByColorProps: ChartProps | null
let statusDisplayProps: StatusDisplayProps | null

vi.mock("@/components/deck-stats/ColorDistributionChart", () => ({
  ColorDistributionChart: (props: ChartProps) => {
    colorChartProps = props
    return <div data-testid="color-chart" />
  },
}))

vi.mock("@/components/deck-stats/CardsByColor", () => ({
  CardsByColor: (props: ChartProps) => {
    cardsByColorProps = props
    return <div data-testid="cards-by-color" />
  },
}))

vi.mock("@/components/deck-stats/StatusEffectsDisplay", () => ({
  StatusEffectsDisplay: (props: StatusDisplayProps) => {
    statusDisplayProps = props
    return <div data-testid="status-effects" />
  },
}))

type TestData = Pick<Database, "characters" | "charSkillMap">
type AvailableCard = { card: { id: number; name: string; color: string; ownerId: number }; extraInfo: CardExtraInfo }
type TestSelectedCard = Pick<SelectedCard, "id" | "useType" | "useParam" | "skillId">

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
        ] satisfies TestSelectedCard[]}
        availableCards={[
          {
            card: { id: 1, name: "Card A", color: "Red", ownerId: 1 },
            extraInfo: { name: "Card A", desc: "", cost: 1, amount: 2 },
          },
          {
            card: { id: 2, name: "Card B", color: "Blue", ownerId: 2 },
            extraInfo: { name: "Card B", desc: "", cost: 1, amount: 1 },
          },
        ] satisfies AvailableCard[]}
        data={{
          characters: { "1": { name: "char.one" }, "2": { name: "char.two" } },
          charSkillMap: { "1": { skills: [10] } },
        } satisfies TestData}
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
        ] satisfies TestSelectedCard[]}
        availableCards={[
          {
            card: { id: 1, name: "Card A", color: "Red", ownerId: 1 },
            extraInfo: { name: "Card A", desc: "", cost: 1, amount: 1 },
          },
          {
            card: { id: 2, name: "Card B", color: "Blue", ownerId: 2 },
            extraInfo: { name: "Card B", desc: "", cost: 1, amount: 1 },
          },
        ] satisfies AvailableCard[]}
        data={{
          characters: { "1": { name: "char.one" } },
          charSkillMap: { "1": { skills: [10] } },
        } satisfies TestData}
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
