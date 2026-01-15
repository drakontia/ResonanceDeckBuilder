"use client"

import type React from "react"

import { useRef } from "react"
import { Globe, Download, Upload, RefreshCw, Share2, HelpCircle, Save, FolderOpen, UsersRound } from "lucide-react"
import { StylizedTitle } from "./stylized-title"
import { HelpModal } from "./ui/modal/HelpModal"
import { ScreenshotButton } from "./screenshot-button"
import { useLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import { useRouter, Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useTopBar } from "@/hooks/deck-builder/useTopBar"

interface TopBarProps {
  onClear: () => void
  onImport: () => Promise<void>
  onExport: () => void
  onShare: () => void
  onSave: () => void // 추가: 저장 버튼 핸들러
  onLoad: () => void // 추가: 불러오기 버튼 핸들러
  onSortCharacters?: () => void
  contentRef: React.RefObject<HTMLDivElement | null> // 추가: 캡처할 컨텐츠 참조
}

export function TopBar({
  onClear,
  onImport,
  onExport,
  onShare,
  onSave,
  onLoad,
  onSortCharacters,
  contentRef,
}: TopBarProps) {
  const helpPopupRef = useRef<HTMLDivElement>(null)
  const languageButtonRef = useRef<HTMLButtonElement>(null)

  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

  // 言語変更ハンドラー
  const onLanguageChange = (newLocale: string) => {
    router.replace("/", { locale: newLocale })
  }

  // Use custom hook for all business logic
  const {
    showLanguageMenu,
    scrolled,
    showHelpPopup,
    setShowHelpPopup,
    languageMenuRef,
    toggleLanguageMenu,
    handleLanguageSelect,
    toggleHelpPopup,
  } = useTopBar({ onLanguageChange })

  // 상단 바 컴포넌트의 버튼 크기 조정 - 작은 화면에서 더 작게 표시
  const buttonBaseClass = `neon-button flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors duration-200 shadow-md relative overflow-hidden`

  // 버튼 아이콘 스타일 클래스 - 작은 화면에서 더 작게 표시
  const iconClass = `w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--neon-white))] relative z-10`

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md shadow-lg py-2" : "bg-black py-4"
        }`}
        style={{ width: "100%" }}
      >
        <div className="container mx-auto px-4">
          {/* 큰 화면에서는 타이틀과 버튼이 같은 행에 표시되고, 작은 화면에서는 버튼이 아래로 내려감 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Logo/Title - 스크롤 시 숨김 */}
            <div className={`flex items-center ${scrolled ? "hidden" : ""}`}>
              <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                <StylizedTitle
                  mainText={t("app.title.main") || "레조넌스"}
                  subText={t("app.title.sub") || "SOLSTICE"}
                />
              </Link>
            </div>

            {/* 버튼들 - 작은 화면에서는 가로 스크롤, 큰 화면에서는 오른쪽 정렬 */}
            {/* 간격 조절 - space-x-3에서 space-x-1로 변경하여 더 많은 버튼이 화면에 들어오도록 함 */}
            <div className="flex items-center space-x-1 sm:space-x-2 mt-2 md:mt-0 overflow-x-auto py-1 justify-end">
              {/* Language Selector */}
              <div className="relative language-dropdown">
                <button
                  ref={languageButtonRef}
                  onClick={toggleLanguageMenu}
                  className={`${buttonBaseClass} language-button`}
                  aria-label={t("language") || "Language"}
                  title={t("language") || "Language"}
                >
                  <Globe className={iconClass} />
                </button>

                {showLanguageMenu && (
                  <div
                    ref={languageMenuRef}
                    className="fixed mt-2 w-40 neon-dropdown animate-fadeIn bg-black bg-opacity-95 z-[100]"
                    style={{
                      top: "var(--language-dropdown-top, 4rem)",
                      left: "var(--language-dropdown-left, auto)",
                      right: "var(--language-dropdown-right, auto)",
                    }}
                  >
                    {routing.locales.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`block w-full text-left px-4 py-3 text-sm hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-150 ${
                          locale === lang
                            ? "bg-[rgba(255,255,255,0.1)] text-[hsl(var(--neon-white))] neon-text"
                            : ""
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Screenshot Button - 캡처 버튼으로 변경 */}
              <ScreenshotButton targetRef={contentRef} />

              {/* Share Button */}
              <button
                onClick={onShare}
                className={`${buttonBaseClass} share-button`}
                aria-label={t("share") || "Share"}
                title={t("share") || "Share"}
              >
                <Share2 className={iconClass} />
              </button>

              {/* Save Button - 추가 */}
              <button
                onClick={onSave}
                className={`${buttonBaseClass} save-button`}
                aria-label={t("save_deck") || "Save Deck"}
                title={t("save_deck") || "Save Deck"}
              >
                <Save className={iconClass} />
              </button>

              {/* Load Button - 추가 */}
              <button
                onClick={onLoad}
                className={`${buttonBaseClass} load-button`}
                aria-label={t("load_deck") || "Load Deck"}
                title={t("load_deck") || "Load Deck"}
              >
                <FolderOpen className={iconClass} />
              </button>

              {/* Sort Characters Button - 추가 */}
              {onSortCharacters && (
                <button
                  onClick={onSortCharacters}
                  className={`${buttonBaseClass} sort-button`}
                  aria-label={t("sort_characters") || "Sort Characters"}
                  title={t("sort_characters") || "Sort Characters"}
                >
                  <UsersRound className={iconClass} />
                </button>
              )}

              {/* Clear Button */}
              <button
                onClick={onClear}
                className={`${buttonBaseClass} clear-button`}
                aria-label={t("button.clear") || "Clear"}
                title={t("button.clear") || "Clear"}
              >
                <RefreshCw className={iconClass} />
              </button>

              {/* Import Button */}
              <button
                onClick={onImport}
                className={`${buttonBaseClass} import-button`}
                aria-label={t("import_from_clipboard") || "Import"}
                title={t("import_from_clipboard") || "Import"}
              >
                <Download className={iconClass} />
              </button>

              {/* Export Button */}
              <button
                onClick={onExport}
                className={`${buttonBaseClass} export-button`}
                aria-label={t("export_to_clipboard") || "Export"}
                title={t("export_to_clipboard") || "Export"}
              >
                <Upload className={iconClass} />
              </button>

              {/* Help Button */}
              <button
                onClick={toggleHelpPopup}
                className={`${buttonBaseClass} help-button`}
                aria-label={t("help.title") || "Help"}
                title={t("help.title") || "Help"}
              >
                <HelpCircle className={iconClass} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 도움말 모달 - 전체 화면을 덮도록 수정하고 TopBar 바깥으로 이동 */}
      {showHelpPopup && (
        <HelpModal
          isOpen={showHelpPopup}
          onClose={() => setShowHelpPopup(false)}
          maxWidth="max-w-2xl"
        />
      )}
    </>
  )
}
