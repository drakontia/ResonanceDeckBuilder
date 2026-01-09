"use client"
import { Modal, type ModalProps } from "./Modal"
import { Globe, Download, Upload, RefreshCw, Share2, Camera, Save, FolderOpen, Star, Hand, UsersRound } from "lucide-react"
import { useTranslations } from 'next-intl';

export interface HelpModalProps extends Omit<ModalProps, "children" | "title"> {}

export function HelpModal(modalProps: HelpModalProps) {
  // 모든 버튼 크기와 모양 통일 - 고정 너비 추가
  const buttonBaseClass =
    "neon-button flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 shadow-md relative overflow-hidden flex-shrink-0"

  // 버튼 아이콘 스타일 클래스
  const iconClass = "w-6 h-6 text-[hsl(var(--neon-white))] relative z-10"

  const t = useTranslations();

  return (
    <Modal
      {...modalProps}
      title={<h2 className="text-xl font-bold neon-text">{t("help.title") || "Button Guide"}</h2>}
      footer={
        <div className="flex justify-end">
          <button onClick={modalProps.onClose} className="neon-button px-4 py-2 rounded-lg text-sm">
            Close
          </button>
        </div>
      }
    >
      <div
        className="p-6 space-y-6 overflow-y-auto max-h-[60vh]"
        style={{ backgroundColor: "var(--modal-content-bg)" }}
      >
        {/* Language Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <Globe className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("language") || "Language"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.language") || "Change the application language"}
            </p>
          </div>
        </div>

        {/* Photo Mode Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <Camera className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("capture-screenshot") || "Screen Shot"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.photo_mode") || ""}
            </p>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <Share2 className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("share") || "Share"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.share") || "Copy a shareable link to your clipboard"}
            </p>
          </div>
        </div>

        {/* Save Button - 새로 추가 */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <Save className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("save_deck") || "Save Deck"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.save_deck") || "Save current deck configuration locally"}
            </p>
          </div>
        </div>

        {/* Load Button - 새로 추가 */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <FolderOpen className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("load_deck") || "Load Deck"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.load_deck") || "Load a saved deck configuration"}
            </p>
          </div>
        </div>

        {/* Sort Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <UsersRound className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("sort_characters") || "Load Deck"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.sort_characters") || "Load a saved deck configuration"}
            </p>
          </div>
        </div>

        {/* Clear Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <RefreshCw className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("button.clear") || "Clear"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.clear") || "Reset all selections and settings"}
            </p>
          </div>
        </div>

        {/* Import Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <Download className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("import_from_clipboard") || "Import"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.import") || "Import a deck configuration from clipboard"}
            </p>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex items-start">
          <div className={`${buttonBaseClass} mr-4`}>
            <Upload className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("export_to_clipboard") || "Export"}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.export") || "Export current deck configuration to clipboard"}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 shadow-md relative overflow-hidden flex-shrink-0 mr-4">
            <Star className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("character.breakthroughs")}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.breakthroughs") || "Load a saved deck configuration"}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 shadow-md relative overflow-hidden flex-shrink-0 mr-4">
            <Hand className={iconClass} />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium neon-text">{t("usage_settings")}</h3>
            <p className="text-sm text-gray-400 break-words">
              {t("help.usage_settings") || "Load a saved deck configuration"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
