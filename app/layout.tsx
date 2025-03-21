import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Karla } from "next/font/google"

const karla = Karla({ subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Good First Issues | Open Source Starter Tasks",
  description: "Find beginner-friendly GitHub issues labeled 'good first issue' to contribute to open source projects effortlessly.",
  keywords: "good first issues, GitHub issues, open source, beginner-friendly issues, contribute to open source, first-time contributors",
  authors: [{ name: "michahl", url: "https://github.com/michahl" }],
  openGraph: {
    title: "Good First Issues | Open Source Starter Tasks",
    description: "Easily find beginner-friendly GitHub issues to start contributing to open source projects.",
    url: "https://good-first-issu.vercel.app",
    siteName: "Good First Issues",
    images: [
      {
        url: "https://good-first-issu.vercel.app/assets/screenshot.png",
        width: 1200,
        height: 630,
        alt: "Good First Issues - Find beginner-friendly GitHub issues",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cht5m",
    title: "Good First Issues | Open Source Starter Tasks",
    description: "Find beginner-friendly GitHub issues labeled 'good first issue' to contribute to open source projects effortlessly.",
    images: ["https://good-first-issu.vercel.app/assets/screenshot.png"],
  },
  icons: {
    icon: [
      { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/assets/favicon/favicon-16x16.png", sizes: "16x16" },
      "/assets/favicon/favicon.ico"
    ],
    apple: "/assets/favicon/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/assets/favicon/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/assets/favicon/android-chrome-512x512.png", sizes: "512x512" }
    ]
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased ${karla.className} selection:bg-blue-950/60 selection:text-white/75`}>{children}</body>
    </html>
  )
}

