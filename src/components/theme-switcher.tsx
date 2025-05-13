"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-10 h-10 transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Moon className="h-5 w-5 transition-all" /> : <Sun className="h-5 w-5 transition-all" />}
    </Button>
  )
}
