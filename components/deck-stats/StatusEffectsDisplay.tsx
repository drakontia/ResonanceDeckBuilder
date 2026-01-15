interface StatusEffectsDisplayProps {
  statusEffects: {
    id: number
    name: string
    description: string
    color: string
    source?: string
  }[]
  includeDerivedCards: boolean
  t: (key: string) => string
}

export function StatusEffectsDisplay({ statusEffects, includeDerivedCards, t }: StatusEffectsDisplayProps) {
  return (
    <div className="neon-container p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4 neon-text">{t("status_effects") || "Status Effects"}</h3>
      {statusEffects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {statusEffects.map((effect) => (
            <div
              key={effect.id}
              className={`relative group ${!includeDerivedCards && effect.source === "derived" ? "hidden" : ""}`}
            >
              <span
                className="px-2 py-1 bg-black bg-opacity-50 border rounded-md text-sm cursor-help"
                style={{
                  borderColor: effect.color,
                  color: effect.color,
                  boxShadow: `0 0 5px ${effect.color}40`,
                }}
              >
                {effect.name}
              </span>

              {/* Tooltip */}
              <div
                className="absolute left-0 bottom-full mb-2 w-64 bg-black bg-opacity-90 p-2 rounded text-xs text-gray-300 
                           invisible group-hover:visible z-10 border border-gray-700 pointer-events-none"
              >
                <div className="font-bold mb-1" style={{ color: effect.color }}>
                  {effect.name}
                </div>
                <div>{effect.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{t("no_status_effects") || "No status effects found"}</p>
      )}
    </div>
  )
}
