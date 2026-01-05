import type React from "react"
import "./globals.css"
import { getLocale } from "next-intl/server"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/images/favicon.png" sizes="any" />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  )
}
