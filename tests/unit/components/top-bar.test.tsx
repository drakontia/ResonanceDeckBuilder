/** @vitest-environment jsdom */
import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TopBar } from "@/components/top-bar"

const topBarMocks = vi.hoisted(() => ({
  handleLanguageSelect: vi.fn(),
  toggleHelpPopup: vi.fn(),
  toggleLanguageMenu: vi.fn(),
  setShowHelpPopup: vi.fn(),
}))

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}))

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "jp"] },
}))

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/hooks/deck-builder/useTopBar", () => ({
  useTopBar: () => ({
    showLanguageMenu: true,
    scrolled: false,
    showHelpPopup: true,
    setShowHelpPopup: topBarMocks.setShowHelpPopup,
    languageMenuRef: { current: null },
    toggleLanguageMenu: topBarMocks.toggleLanguageMenu,
    handleLanguageSelect: topBarMocks.handleLanguageSelect,
    toggleHelpPopup: topBarMocks.toggleHelpPopup,
  }),
}))

vi.mock("@/components/screenshot-button", () => ({
  ScreenshotButton: () => <button data-testid="screenshot-button" />,
}))

vi.mock("@/components/ui/modal/HelpModal", () => ({
  HelpModal: ({ isOpen }: { isOpen: boolean }) => (isOpen ? <div data-testid="help-modal" /> : null),
}))

describe("TopBar", () => {
  const baseProps = {
    onClear: vi.fn(),
    onImport: vi.fn(async () => {}),
    onExport: vi.fn(),
    onShare: vi.fn(),
    onSave: vi.fn(),
    onLoad: vi.fn(),
    contentRef: { current: document.createElement("div") },
  }

  it("renders buttons and language menu", () => {
    render(<TopBar {...baseProps} />)

    expect(screen.getByText("app.title.main")).toBeTruthy()
    expect(screen.getByTestId("screenshot-button")).toBeTruthy()
    expect(screen.getByText("EN")).toBeTruthy()
    expect(screen.getByText("JP")).toBeTruthy()
    expect(screen.getByTestId("help-modal")).toBeTruthy()
  })

  it("calls handlers for key actions", () => {
    render(<TopBar {...baseProps} onSortCharacters={vi.fn()} />)

    fireEvent.click(screen.getByLabelText("button.clear"))
    fireEvent.click(screen.getByLabelText("share"))
    fireEvent.click(screen.getByLabelText("save_deck"))
    fireEvent.click(screen.getByLabelText("load_deck"))
    fireEvent.click(screen.getByLabelText("help.title"))

    expect(baseProps.onClear).toHaveBeenCalled()
    expect(baseProps.onShare).toHaveBeenCalled()
    expect(baseProps.onSave).toHaveBeenCalled()
    expect(baseProps.onLoad).toHaveBeenCalled()
    expect(topBarMocks.toggleHelpPopup).toHaveBeenCalled()
  })

  it("renders sort button only when provided", () => {
    const { rerender } = render(<TopBar {...baseProps} />)

    expect(screen.queryByLabelText("sort_characters")).toBeNull()

    rerender(<TopBar {...baseProps} onSortCharacters={vi.fn()} />)

    expect(screen.getByLabelText("sort_characters")).toBeTruthy()
  })

  it("calls language handlers", () => {
    render(<TopBar {...baseProps} />)

    fireEvent.click(screen.getByLabelText("language"))
    fireEvent.click(screen.getByText("EN"))

    expect(topBarMocks.toggleLanguageMenu).toHaveBeenCalled()
    expect(topBarMocks.handleLanguageSelect).toHaveBeenCalledWith("en")
  })
})
