/** @vitest-environment jsdom */
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SkillCard } from "@/components/skill-card"
import type { Card, CardExtraInfo, Skill } from "@/types"

const richMock = vi.fn((key: string) => key)

const t = Object.assign(
  (key: string) => key,
  {
    rich: richMock,
  },
)

vi.mock("next-intl", () => ({
  useLocale: () => "jp",
  useTranslations: () => t,
}))

vi.mock("@/lib/charSkillMap", () => ({
  charSkillMap: {
    10000001: { skills: [12300007] },
  },
}))

describe("SkillCard", () => {
  it("leaderCardConditionDesc の翻訳が失敗しても落ちずに描画する", () => {
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
        leaderCardConditionDesc: "skill.customLeaderDesc",
      } as Skill,
    } as CardExtraInfo

    richMock.mockImplementationOnce(() => {
      throw new Error("missing translation")
    })

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

  it("リーダースキル表示と条件表示を行い、クリックと画像エラーを処理する", () => {
    const onEdit = vi.fn()
    const onContextMenuPreventDefault = vi.fn()

    const card = {
      id: 1001,
      name: "card.name",
      ownerId: 10000001,
      ExCondList: [{ des: "needs_buff", isNumCond: true }],
      ExActList: [{ des: "after_attack" }],
    } as Card

    const extraInfo = {
      name: "skill.name",
      desc: "skill.desc",
      cost: 1,
      amount: 1,
      img_url: "/skill.png",
      skillObj: {
        id: 12300007,
        leaderCardConditionDesc: "skill.validLeaderDesc",
      } as Skill,
    } as CardExtraInfo

    richMock.mockImplementation((key: string) => `translated:${key}`)

    const { container, rerender } = render(
      <SkillCard
        card={card}
        extraInfo={extraInfo}
        onRemove={() => {}}
        onEdit={onEdit}
        isDisabled={false}
        characterImage="/broken-image.jpg"
        useType={3}
        useParam={5}
        leaderCharacter={10000001}
      />,
    )

    const cardElement = container.querySelector(".skill-card")
    expect(cardElement).not.toBeNull()
    fireEvent.click(cardElement!)

    const contextMenuEvent = new MouseEvent("contextmenu", { bubbles: true, cancelable: true })
    vi.spyOn(contextMenuEvent, "preventDefault").mockImplementation(onContextMenuPreventDefault)
    fireEvent(cardElement!, contextMenuEvent)

    const backgroundImage = container.querySelector('img[src="/broken-image.jpg"]')
    expect(backgroundImage).not.toBeNull()
    fireEvent.error(backgroundImage!)

    expect(onEdit).toHaveBeenCalledOnce()
    expect(onContextMenuPreventDefault).toHaveBeenCalledOnce()
    expect(container.querySelector('svg[class*="lucide-flag"]')).not.toBeNull()
    expect(screen.getByText("text_needs_buff: 5")).toBeInTheDocument()
    expect(backgroundImage).toHaveAttribute("src", "jp/images/placeHolderCard.jpg")

    rerender(
      <SkillCard
        card={card}
        extraInfo={extraInfo}
        onRemove={() => {}}
        onEdit={onEdit}
        isDisabled={false}
        useType={4}
        useParam={0}
        leaderCharacter={10000001}
      />,
    )

    expect(screen.getByText("text_after_attack")).toBeInTheDocument()
  })

  it("ExActList の数値付き指定番号オプションでもパラメータを表示する", () => {
    const card = {
      id: 1001,
      name: "card.name",
      ownerId: 10000001,
      ExCondList: [],
      ExActList: [
        { des: "after_attack" },
        { des: "specified_ally", isNumCond: true, minNum: 1, interValNum: 5, numDuration: 1 },
      ],
    } as Card

    const extraInfo = {
      name: "skill.name",
      desc: "skill.desc",
      cost: 1,
      amount: 1,
      img_url: "/skill.png",
      skillObj: {
        id: 12300007,
        leaderCardConditionDesc: "skill.validLeaderDesc",
      } as Skill,
    } as CardExtraInfo

    render(
      <SkillCard
        card={card}
        extraInfo={extraInfo}
        onRemove={() => {}}
        onEdit={() => {}}
        isDisabled={false}
        useType={4}
        useParam={3}
        leaderCharacter={10000001}
      />,
    )

    expect(screen.getByText("text_specified_ally: 3")).toBeInTheDocument()
  })
})
