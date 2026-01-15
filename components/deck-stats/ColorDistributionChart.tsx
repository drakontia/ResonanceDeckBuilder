import { useTranslations } from "next-intl"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"

interface ColorDistributionChartProps {
  colorDistribution: {
    name: string
    translatedName: string
    count: number
    cards: { name: string; quantity: number; characterName?: string }[]
    orderIndex: number
  }[]
  colorMap: Record<string, string>
}

export function ColorDistributionChart({ colorDistribution, colorMap }: ColorDistributionChartProps) {
  const t = useTranslations()
  return (
    <div className="neon-container p-4">
      <h3 className="text-lg font-semibold mb-4 neon-text">
        {t("color_distribution") || "Color Distribution"}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={colorDistribution}>
            <XAxis dataKey="translatedName" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, name === "count" ? t("cards") || "Cards" : name]}
              labelFormatter={(label) => `${label} ${t("cards") || "Cards"}`}
            />
            <Legend />
            <Bar dataKey="count" name="Cards">
              {colorDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[entry.name] || colorMap.Unknown} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
