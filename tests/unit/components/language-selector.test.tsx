/** @vitest-environment jsdom */
import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { LanguageSelector } from "@/components/language-selector"

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}))

describe("LanguageSelector", () => {
  it("renders options and calls onChange", () => {
    const onChangeLanguage = vi.fn()

    render(
      <LanguageSelector
        currentLanguage="en"
        onChangeLanguage={onChangeLanguage}
        availableLanguages={["en", "jp"]}
      />,
    )

    expect(screen.getByText(/language/i)).toBeTruthy()
    expect(screen.getByRole("option", { name: "EN" })).toBeTruthy()
    expect(screen.getByRole("option", { name: "JP" })).toBeTruthy()

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "jp" } })

    expect(onChangeLanguage).toHaveBeenCalledWith("jp")
  })
})
