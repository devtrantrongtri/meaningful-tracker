"use client"

import { useEffect, useState } from "react"
import type { LogEntry } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Lightbulb, TrendingUp, Clock, Heart, Brain } from "lucide-react"

interface AIInsightsProps {
  logs: LogEntry[]
}

export function AIInsights({ logs }: AIInsightsProps) {
  const { t } = useLanguage()
  const [insights, setInsights] = useState<string[]>([])

  useEffect(() => {
    if (logs.length < 3) {
      setInsights([t("dashboard.notEnoughData")])
      return
    }

    const newInsights: string[] = []

    // Check for mood patterns
    const moodCounts: Record<string, number> = {}
    logs.forEach((log) => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    })

    const totalLogs = logs.length
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

    if (dominantMood && dominantMood[1] / totalLogs > 0.5) {
      newInsights.push(t("dashboard.dominantMoodInsight").replace("{mood}", t(`mood.${dominantMood[0]}`)))
    }

    // Check for work type patterns
    const workTypeCounts: Record<string, number> = {}
    logs.forEach((log) => {
      workTypeCounts[log.work_type] = (workTypeCounts[log.work_type] || 0) + 1
    })

    const dominantWorkType = Object.entries(workTypeCounts).sort((a, b) => b[1] - a[1])[0]

    if (dominantWorkType && dominantWorkType[1] / totalLogs > 0.4) {
      newInsights.push(
        t("dashboard.dominantWorkTypeInsight").replace("{workType}", t(`workType.${dominantWorkType[0]}`)),
      )
    }

    // Check for energy-meaning correlation
    const energyMeaningCorrelation =
      logs.reduce((sum, log) => {
        return sum + (log.energy_level - 3) * (log.meaning_level - 3)
      }, 0) / logs.length

    if (energyMeaningCorrelation > 1) {
      newInsights.push(t("dashboard.positiveCorrelationInsight"))
    } else if (energyMeaningCorrelation < -1) {
      newInsights.push(t("dashboard.negativeCorrelationInsight"))
    }

    // Check for time patterns
    const weekdayMoods: Record<number, string[]> = {}
    logs.forEach((log) => {
      const date = new Date(log.date)
      const day = date.getDay()
      if (!weekdayMoods[day]) weekdayMoods[day] = []
      weekdayMoods[day].push(log.mood)
    })

    // Check weekend vs weekday mood
    const weekendMoods = [...(weekdayMoods[0] || []), ...(weekdayMoods[6] || [])]
    const weekdayMoodsList = [1, 2, 3, 4, 5].flatMap((day) => weekdayMoods[day] || [])

    const weekendPositive =
      weekendMoods.filter((mood) => mood === "excited" || mood === "happy").length / (weekendMoods.length || 1)

    const weekdayPositive =
      weekdayMoodsList.filter((mood) => mood === "excited" || mood === "happy").length / (weekdayMoodsList.length || 1)

    if (weekendPositive > weekdayPositive + 0.3 && weekendMoods.length >= 2) {
      newInsights.push(t("dashboard.weekendHappierInsight"))
    }

    // Add more insights if needed
    if (newInsights.length < 3) {
      newInsights.push(t("dashboard.generalInsight"))
    }

    setInsights(newInsights)
  }, [logs, t])

  const icons = [
    <Lightbulb key="lightbulb" className="h-5 w-5 text-yellow-500" />,
    <TrendingUp key="trending" className="h-5 w-5 text-blue-500" />,
    <Clock key="clock" className="h-5 w-5 text-green-500" />,
    <Heart key="heart" className="h-5 w-5 text-red-500" />,
    <Brain key="brain" className="h-5 w-5 text-purple-500" />,
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.aiInsights")}</CardTitle>
        <CardDescription>{t("dashboard.aiInsightsDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-3 mt-1">{icons[index % icons.length]}</div>
              <p>{insight}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
