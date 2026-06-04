/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SkillCard } from "@/components/skill-card"
import type { Card, CardExtraInfo, Skill } from "@/types"

const t = Object.assign(
  (key: string) => key,
  {
    rich: (key: string) => {
      if (key === "skill.leaderCardConditionDesc") {
        throw new Error("missing translation")
      }
      return key
    },
  },
)

vi.mock("next-intl", () => ({
  useLocale: () => "jp",
  useTranslations: () => t,
}))

describe("SkillCard", () => {
  it("leaderCardConditionDesc の翻訳が無くても落ちずに描画する", () => {
    const card = {
      id: 1001,
      name: "card.name",
      ownerId: 10000001,
      ExCondList: [],
      ExActList: [],
    } as Card

    const extraInfo = {
      name: "skill.name",
      desc: "skill.desc",
      cost: 1,
      amount: 1,
      img_url: undefined,
      skillObj: {
        id: 12300007,
        leaderCardConditionDesc: "skill.leaderCardConditionDesc",
      } as Skill,
    } as CardExtraInfo

    render(
      <SkillCard
        card={card}
        extraInfo={extraInfo}
        onRemove={() => {}}
        onEdit={() => {}}
        isDisabled={false}
        useType={0}
        useParam={0}
        leaderCharacter={10000001}
      />,
    )

    expect(screen.getByText("card.name")).toBeInTheDocument()
  })
})
