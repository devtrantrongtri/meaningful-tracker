"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { cn } from "@/lib/utils"
import { BarChart, BookText, Home, Plus, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/supabase"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
      } else if (session?.user) {
        const userData = await getCurrentUser()
        setUser(userData)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navItems = [
    {
      href: "/",
      label: t("nav.home"),
      icon: Home,
    },
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      icon: BarChart,
    },
    {
      href: "/log/new",
      label: t("nav.newLog"),
      icon: Plus,
    },
    {
      href: "/logs",
      label: t("nav.logs"),
      icon: BookText,
    },
    {
      href: "/settings",
      label: t("nav.settings"),
      icon: Settings,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">{t("app.name")}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {!loading &&
              (user ? (
                <Button variant="ghost" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="ghost">{t("nav.login")}</Button>
                </Link>
              ))}
          </div>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
