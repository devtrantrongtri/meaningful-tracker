"use client"

import { motion } from "framer-motion"
import type { LogEntry } from "@/lib/types"
import { formatDate, getMoodEmoji, getWorkTypeEmoji } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface TimelineViewProps {
  logs: LogEntry[]
  onDelete: (id: string) => void
}

export function TimelineView({ logs, onDelete }: TimelineViewProps) {
  const { t } = useLanguage()
  const router = useRouter()

  // Group logs by date
  const groupedLogs: Record<string, LogEntry[]> = {}
  logs.forEach((log) => {
    const date = new Date(log.date).toISOString().split("T")[0]
    if (!groupedLogs[date]) {
      groupedLogs[date] = []
    }
    groupedLogs[date].push(log)
  })

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="timeline-container py-8">
      {sortedDates.map((date, dateIndex) => (
        <div key={date} className="mb-12">
          <h3 className="text-xl font-bold mb-4">{formatDate(date)}</h3>

          <div className="space-y-6">
            {groupedLogs[date].map((log, logIndex) => (
              <motion.div
                key={log.id}
                className="timeline-item"
                initial={{ opacity: 0, x: logIndex % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: logIndex * 0.1 }}
              >
                <div className="timeline-content">
                  <Card className="p-4 emotion-card">
                    <div className="flex items-center mb-2">
                      <div className="text-2xl mr-2">{getMoodEmoji(log.mood)}</div>
                      <h4 className="font-bold">{log.title}</h4>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <div className="mr-4 flex items-center">
                        <span className="mr-1">{getWorkTypeEmoji(log.work_type)}</span>
                        <span>{t(`workType.${log.work_type}`)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">⚡</span>
                        <span>{t(`energyLevel.${log.energy_level}`)}</span>
                      </div>
                      <div className="ml-4 flex items-center">
                        <span className="mr-1">✨</span>
                        <span>{t(`meaningLevel.${log.meaning_level}`)}</span>
                      </div>
                    </div>

                    <p className="text-sm mb-4 line-clamp-2">{log.description}</p>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/log/${log.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t("logs.edit")}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(log.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("logs.delete")}
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
