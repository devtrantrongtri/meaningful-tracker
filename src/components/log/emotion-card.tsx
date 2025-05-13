"use client"

import { motion } from "framer-motion"
import type { LogEntry } from "@/lib/types"
import { getColorByMood, getMoodEmoji, getWorkTypeEmoji, formatDate } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface EmotionCardProps {
  log: LogEntry
  onDelete: (id: string) => void
}

export function EmotionCard({ log, onDelete }: EmotionCardProps) {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <motion.div
      className="flip-card w-full h-64"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flip-card-inner w-full h-full relative shadow-lg hover:shadow-xl transition-shadow">
        {/* Front of card */}
        <Card className="flip-card-front absolute w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden border-primary/20">
          <div className={`absolute top-0 left-0 w-full h-2 ${getColorByMood(log.mood)}`} />

          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
          >
            {getMoodEmoji(log.mood)}
          </motion.div>

          <h3 className="text-xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {log.title}
          </h3>

          <p className="text-sm text-muted-foreground text-center mb-4">{formatDate(log.date)}</p>

          <div className="w-full mt-auto">
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t("logs.energy")}</span>
                  <span className="font-medium">{log.energy_level}/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(log.energy_level / 5) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t("logs.meaning")}</span>
                  <span className="font-medium">{log.meaning_level}/5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(log.meaning_level / 5) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>{getWorkTypeEmoji(log.work_type)}</span>
              {t(`workType.${log.work_type}`)}
            </span>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="flip-card-back absolute w-full h-full p-6 overflow-hidden border-primary/20">
          <div className={`absolute top-0 left-0 w-full h-2 ${getColorByMood(log.mood)}`} />

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center px-2 py-1 rounded-full bg-primary/10">
              <span className="mr-2">{getMoodEmoji(log.mood)}</span>
              <span className="font-medium">{t(`mood.${log.mood}`)}</span>
            </div>
            <div className="flex items-center px-2 py-1 rounded-full bg-secondary/10">
              <span className="mr-2">{getWorkTypeEmoji(log.work_type)}</span>
              <span className="font-medium">{t(`workType.${log.work_type}`)}</span>
            </div>
          </div>

          <div className="overflow-auto h-[120px] mb-4 bg-muted/20 p-3 rounded-md">
            <p className="text-sm">{log.description}</p>
          </div>

          <div className="flex justify-between mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/log/${log.id}`)}
              className="border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("logs.edit")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(log.id)}
              className="hover:bg-destructive/90 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("logs.delete")}
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
