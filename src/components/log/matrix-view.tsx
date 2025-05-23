"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { LogEntry, MatrixItem } from "@/lib/types"
import { getMoodEmoji } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { EmotionCard } from "./emotion-card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

interface MatrixViewProps {
  logs: LogEntry[]
  onDelete: (id: string) => void
}

export function MatrixView({ logs, onDelete }: MatrixViewProps) {
  const { t } = useLanguage()
  const [matrixItems, setMatrixItems] = useState<MatrixItem[]>([])
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Convert logs to matrix items
    const items = logs.map((log) => ({
      x: log.energy_level,
      y: log.meaning_level,
      id: log.id,
      title: log.title,
      mood: log.mood,
      date: log.date,
    }))
    setMatrixItems(items)
  }, [logs])

  const handleItemClick = (id: string) => {
    const log = logs.find((log) => log.id === id)
    if (log) {
      setSelectedLog(log)
      setOpen(true)
    }
  }

  // Safe translation function to handle missing translations
  const safeTranslate = (key: string, fallback: string) => {
    try {
      const translated = t(key)
      // If the translation returns the key itself, it means the translation is missing
      return translated === key ? fallback : translated
    } catch (error) {
      return fallback
    }
  }

  return (
    <div className="w-full ">
      <Card className="p-6 relative ">
        <div className="matrix-container h-[600px] relative ">
          {/* Background grid */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="border border-border/20"
              />
            ))}
          </div>

          {/* X and Y axes */}
          <div className="matrix-axis-x"> </div>
          <div className="matrix-axis-y">  </div>

          {/* Axis labels */}
          <div className="matrix-label-x left-0 bg-background/80 px-2 py-1 rounded-md">{safeTranslate("meaningLevel.1", "Not Meaningful")}</div>
          <div className="matrix-label-x right-0 bg-background/80 px-2 py-1 rounded-md">{safeTranslate("meaningLevel.5", "Very Meaningful")}</div>
          <div className="matrix-label-y top-0 bg-background/80 px-2 py-1 rounded-md">{safeTranslate("energyLevel.5", "High Energy")}</div>
          <div className="matrix-label-y bottom-0 bg-background/80 px-2 py-1 rounded-md">{safeTranslate("energyLevel.1", "Low Energy")}</div>

          {/* Quadrant labels */}
          <div className="absolute top-10 left-10 text-xs font-bold bg-red-500/10 text-red-500 dark:text-red-400 px-2 py-1 rounded-md">
            {safeTranslate("dashboard.highEnergyLowMeaning", "High Energy, Low Meaning")}
          </div>
          <div className="absolute top-10 right-10 text-xs font-bold bg-green-500/10 text-green-500 dark:text-green-400 px-2 py-1 rounded-md">
            {safeTranslate("dashboard.highEnergyHighMeaning", "High Energy, High Meaning")}
          </div>
          <div className="absolute bottom-10 left-10 text-xs font-bold bg-orange-500/10 text-orange-500 dark:text-orange-400 px-2 py-1 rounded-md">
            {safeTranslate("dashboard.lowEnergyLowMeaning", "Low Energy, Low Meaning")}
          </div>
          <div className="absolute bottom-10 right-10 text-xs font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 px-2 py-1 rounded-md">
            {safeTranslate("dashboard.lowEnergyHighMeaning", "Low Energy, High Meaning")}
          </div>

          {/* Matrix items */}
          {matrixItems.map((item) => {
            // Calculate position based on energy and meaning levels
            const x = (item.x / 5) * 100
            const y = 100 - (item.y / 5) * 100

            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.2 },
                }}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex flex-col items-center">
                  <div className="text-3xl bg-background/80 p-2 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
                    {getMoodEmoji(item.mood)}
                  </div>
                  <div className="text-xs max-w-[100px] truncate text-center mt-1 bg-background/80 px-2 py-1 rounded-md shadow-sm">
                    {item.title}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Dialog for showing the selected log */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedLog?.title}</DialogTitle>
            <DialogDescription>{selectedLog?.date ? formatDate(selectedLog.date) : ""}</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="mt-4">
              <EmotionCard log={selectedLog} onDelete={onDelete} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
