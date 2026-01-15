import { useTranslations } from "next-intl"

interface CardsByColorProps {
  colorDistribution: {
    name: string
    translatedName: string
    count: number
    cards: { name: string; quantity: number; characterName?: string }[]
    orderIndex: number
  }[]
  colorMap: Record<string, string>
}

export function CardsByColor({ colorDistribution, colorMap }: CardsByColorProps) {
  const t = useTranslations()
  
  return (
    <div className="neon-container p-4">
      <h3 className="text-lg font-semibold mb-4 neon-text">{t("cards_by_color") || "Cards by Color"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colorDistribution.map(({ name, translatedName, cards }) => (
          <div key={name} className="border border-[hsla(var(--neon-white),0.3)] rounded-md p-3">
            <h4 className="font-medium mb-2 flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: colorMap[name] || colorMap.Unknown }}
              ></span>
              {translatedName} ({cards.reduce((sum, card) => sum + card.quantity, 0)})
            </h4>
            <ul className="text-sm space-y-1 text-gray-300">
              {cards.map((card, index) => (
                <li key={index}>
                  <span className="text-white">{card.name}</span> {card.quantity > 1 ? `(${card.quantity})` : ""}
                  {card.characterName && card.characterName.length > 0 && (
                    <span className="text-gray-400 ml-1">- {card.characterName}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
