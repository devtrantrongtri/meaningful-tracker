import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { Navbar } from "@/components/layout/navbar"
import { MobileNav } from "@/components/layout/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Meaningful Tracker",
  description: "Track your activities, emotions, and find meaning in what you do",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 container py-6 md:py-10 pb-20 md:pb-10">{children}</main>
              <MobileNav />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
