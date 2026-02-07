/** @vitest-environment jsdom */
import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { BattleSettings } from "@/components/battle-settings"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

describe("BattleSettings", () => {
  it("updates toggles and select", () => {
    const onUpdateSettings = vi.fn()

    const { container } = render(
      <BattleSettings
        settings={{
          isLeaderCardOn: true,
          isSpCardOn: false,
          keepCardNum: 2,
          discardType: 0,
          otherCard: 1,
        }}
        onUpdateSettings={onUpdateSettings}
      />,
    )

    const leaderInput = screen.getByLabelText("battle.leader.skill") as HTMLInputElement
    const spInput = screen.getByLabelText("battle.ultimate.skill") as HTMLInputElement

    fireEvent.click(leaderInput)
    fireEvent.click(spInput)

    const select = container.querySelector("select#otherCard") as HTMLSelectElement
    fireEvent.change(select, { target: { value: "2" } })

    expect(onUpdateSettings).toHaveBeenCalledWith({ isLeaderCardOn: false })
    expect(onUpdateSettings).toHaveBeenCalledWith({ isSpCardOn: true })
    expect(onUpdateSettings).toHaveBeenCalledWith({ otherCard: 2 })
  })

  it("increments and decrements keepCardNum within bounds", () => {
    const onUpdateSettings = vi.fn()

    const { container, rerender } = render(
      <BattleSettings
        settings={{
          isLeaderCardOn: true,
          isSpCardOn: true,
          keepCardNum: 2,
          discardType: 0,
          otherCard: 0,
        }}
        onUpdateSettings={onUpdateSettings}
      />,
    )

    const buttons = container.querySelectorAll("button.hand-retention-button")
    fireEvent.click(buttons[1])
    fireEvent.click(buttons[0])

    expect(onUpdateSettings).toHaveBeenCalledWith({ keepCardNum: 3 })
    expect(onUpdateSettings).toHaveBeenCalledWith({ keepCardNum: 1 })

    onUpdateSettings.mockClear()

    rerender(
      <BattleSettings
        settings={{
          isLeaderCardOn: true,
          isSpCardOn: true,
          keepCardNum: 5,
          discardType: 0,
          otherCard: 0,
        }}
        onUpdateSettings={onUpdateSettings}
      />,
    )

    const maxButtons = container.querySelectorAll("button.hand-retention-button")
    fireEvent.click(maxButtons[1])
    expect(onUpdateSettings).not.toHaveBeenCalled()

    rerender(
      <BattleSettings
        settings={{
          isLeaderCardOn: true,
          isSpCardOn: true,
          keepCardNum: 0,
          discardType: 0,
          otherCard: 0,
        }}
        onUpdateSettings={onUpdateSettings}
      />,
    )

    const minButtons = container.querySelectorAll("button.hand-retention-button")
    fireEvent.click(minButtons[0])
    expect(onUpdateSettings).not.toHaveBeenCalled()
  })
})
