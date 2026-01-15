import { useState, useEffect, useRef } from "react"

interface UseTopBarProps {
  onLanguageChange: (locale: string) => void
}

export function useTopBar({ onLanguageChange }: UseTopBarProps) {
  // State management
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Click outside detection for language menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }

    if (showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showLanguageMenu])

  // Event handlers
  const toggleLanguageMenu = () => {
    setShowLanguageMenu((prev) => !prev)
  }

  const handleLanguageSelect = (locale: string) => {
    onLanguageChange(locale)
    setShowLanguageMenu(false)
  }

  const toggleHelpPopup = () => {
    setShowHelpPopup((prev) => !prev)
  }

  return {
    // State
    showLanguageMenu,
    scrolled,
    showHelpPopup,
    setShowHelpPopup,
    languageMenuRef,

    // Event handlers
    toggleLanguageMenu,
    handleLanguageSelect,
    toggleHelpPopup,
  }
}
