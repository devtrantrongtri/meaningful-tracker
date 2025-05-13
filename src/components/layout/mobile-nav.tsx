"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart, BookText, Home, Plus, Settings } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

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
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-gray-800",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
