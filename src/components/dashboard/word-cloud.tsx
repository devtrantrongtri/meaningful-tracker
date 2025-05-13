"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { LogEntry, Word } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopWords, getWordFrequency } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface WordCloudProps {
  logs: LogEntry[]
}

export function WordCloud({ logs }: WordCloudProps) {
  const { t } = useLanguage()
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    if (logs.length === 0) return

    // Extract descriptions from logs
    const descriptions = logs.map((log) => log.description)

    // Get word frequency
    const wordFreq = getWordFrequency(descriptions)

    // Get top words
    const topWords = getTopWords(wordFreq, 30)

    setWords(topWords)
  }, [logs])

  // Function to determine font size based on word frequency
  const getFontSize = (value: number) => {
    const maxValue = Math.max(...words.map((word) => word.value))
    const minSize = 12
    const maxSize = 36

    return minSize + (value / maxValue) * (maxSize - minSize)
  }

  // Function to get a color based on word frequency
  const getColor = (value: number) => {
    const maxValue = Math.max(...words.map((word) => word.value))
    const colors = ["text-primary", "text-secondary", "text-accent", "text-highlight-foreground", "text-purple-500"]

    const index = Math.floor((value / maxValue) * (colors.length - 1))
    return colors[index]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.wordCloud")}</CardTitle>
        <CardDescription>{t("dashboard.wordCloudDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {words.length > 0 ? (
          <div className="word-cloud min-h-[200px] flex items-center justify-center">
            {words.map((word, index) => (
              <motion.div
                key={word.text}
                className={`word-cloud-item ${getColor(word.value)}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                style={{ fontSize: `${getFontSize(word.value)}px` }}
              >
                {word.text}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">{t("dashboard.noDataAvailable")}</div>
        )}
      </CardContent>
    </Card>
  )
}
