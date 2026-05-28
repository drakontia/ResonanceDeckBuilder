import { use } from "react"
import DeckBuilder from "../../components/deckBuilder"
import { PageViewTracker } from "../../components/page-view-tracker"

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ code?: string }>
}) {
  const { locale } = use(params)
  const { code } = use(searchParams)
  const deckCode = code ?? null

  return (
    <>
      <PageViewTracker locale={locale} deckCode={deckCode} />
      <DeckBuilder urlDeckCode={deckCode} />
    </>
  )
}
