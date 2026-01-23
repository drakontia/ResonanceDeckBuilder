"use client"

import { TopBar } from "./top-bar"
import { CharacterWindow } from "./character-window"
import { SkillWindow } from "./skill-window"
import { BattleSettings } from "./battle-settings"
import { CommentsSection } from "./comments-section"
import { LoadingScreen } from "./loading-screen"
import { SaveDeckModal } from "./ui/modal/SaveDeckModal"
import { LoadDeckModal } from "./ui/modal/LoadDeckModal"
import { useDeckBuilderPage } from "../hooks/deck-builder/useDeckBuilderPage"
import { useTranslations, useLocale } from "next-intl"

interface DeckBuilderProps {
  urlDeckCode: string | null
}

export default function DeckBuilder({ urlDeckCode }: DeckBuilderProps) {
  const t = useTranslations()
  const {
    ToastContainer,
    contentRef,
    data,
    loading,
    error,
    isLocalLoading,
    availableCards,
    selectedCharacters,
    leaderCharacter,
    selectedCards,
    battleSettings,
    equipment,
    awakening,
    getCharacter,
    getCardInfo,
    getEquipment,
    getSkill,
    allEquipments,
    addCharacter,
    removeCharacter,
    setLeader,
    addCard,
    removeCard,
    reorderCards,
    updateCardSettings,
    updateBattleSettings,
    updateEquipment,
    handleAwakeningSelect,
    handleImport,
    handleExport,
    handleShare,
    handleClear,
    handleOpenSaveModal,
    handleOpenLoadModal,
    handleCloseSaveModal,
    handleCloseLoadModal,
    showSaveModal,
    showLoadModal,
    handleSaveSuccess,
    handleLoadDeck,
    handleDeleteDeck,
    handleShareSavedDeck,
    getCharacterName,
    handleSortCharacters,
    createPresetObject,
  } = useDeckBuilderPage(urlDeckCode)

  if (loading || isLocalLoading) {
    return <LoadingScreen message={t("loading") || "Loading..."} />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500 p-4 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">{t("error_loading_data") || "Error Loading Data"}</h2>
          <p>{error.message}</p>
          <p className="mt-2 text-sm">{t("check_console") || "Please check console for more details."}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-yellow-500 p-4 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">{t("no_data") || "No Data Available"}</h2>
          <p>{t("data_not_loaded") || "Data could not be loaded. Please try again later."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer />

      <TopBar
        onClear={handleClear}
        onImport={handleImport}
        onExport={handleExport}
        onShare={handleShare}
        onSave={handleOpenSaveModal}
        onLoad={handleOpenLoadModal}
        onSortCharacters={handleSortCharacters}
        contentRef={contentRef}
      />

      <div className="container mx-auto px-0 sm:px-3 md:px-4 pt-40 md:pt-28 pb-8">
        <div ref={contentRef} className="capture-content">
          <CharacterWindow
            selectedCharacters={selectedCharacters}
            leaderCharacter={leaderCharacter}
            onAddCharacter={addCharacter}
            onRemoveCharacter={removeCharacter}
            onSetLeader={setLeader}
            getCharacter={getCharacter}
            availableCharacters={data && data.characters ? Object.values(data.characters) : []}
            equipment={equipment}
            onEquipItem={updateEquipment}
            getCardInfo={getCardInfo}
            getEquipment={getEquipment}
            equipments={allEquipments}
            data={data}
            getSkill={getSkill}
            awakening={awakening}
            onAwakeningSelect={handleAwakeningSelect}
          />

          <div className="mt-8">
            <h2 className="neon-section-title">{t("skill.section.title") || "Skills"}</h2>
            <SkillWindow
              selectedCards={selectedCards}
              availableCards={availableCards}
              onRemoveCard={removeCard}
              onReorderCards={reorderCards}
              onUpdateCardSettings={updateCardSettings}
              leaderCharacter={leaderCharacter}
              data={data}
            />
          </div>

          <BattleSettings settings={battleSettings} onUpdateSettings={updateBattleSettings} />
        </div>
      </div>

      <div className="mt-0 mb-0 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
        <span>Resonance Deck Builder © 2025 Heeyong Chang</span>
        <span className="hidden sm:inline">·</span>
        <a href="https://github.com/drakontia/ResonanceDeckBuilder" target="_blank" rel="noopener noreferrer">
          <img className="w-6 h-6" src="images/github-mark-white2.svg" />
        </a>
        <iframe src="https://github.com/sponsors/drakontia/button" title="Sponsor drakontia" height="32" width="114" style={{border: 0, borderRadius: '6px'}}></iframe>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">GPLv3</span>
      </div>

      <CommentsSection />

      <SaveDeckModal
        isOpen={showSaveModal}
        onClose={handleCloseSaveModal}
        preset={createPresetObject(true, true)}
        onSaveSuccess={handleSaveSuccess}
        getCharacterName={getCharacterName}
      />

      <LoadDeckModal
        isOpen={showLoadModal}
        onClose={handleCloseLoadModal}
        onLoadDeck={handleLoadDeck}
        onDeleteDeck={handleDeleteDeck}
        onShareDeck={handleShareSavedDeck}
      />
    </div>
  )
}
