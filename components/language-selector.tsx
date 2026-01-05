"use client"

import { useTranslations } from "next-intl"

interface LanguageSelectorProps {
  currentLanguage: string
  onChangeLanguage: (language: string) => void
  availableLanguages: string[]
}

export function LanguageSelector({
  currentLanguage,
  onChangeLanguage,
  availableLanguages,
}: LanguageSelectorProps) {
  const t = useTranslations()
  return (
    <div className="flex items-center space-x-2 mb-4">
      <label htmlFor="language" className="text-sm font-medium">
        {t("language") || "Language"}:
      </label>
      <select
        id="language"
        value={currentLanguage}
        onChange={(e) => onChangeLanguage(e.target.value)}
        className="p-1 border rounded text-sm"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}

