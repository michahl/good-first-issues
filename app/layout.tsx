import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Karla } from "next/font/google"

const karla = Karla({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "good first issues | @michahl",
  description: "discord good first issues in open source projects",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={karla.className}>{children}</body>
    </html>
  )
}

