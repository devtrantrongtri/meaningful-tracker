"use client"

import { useLogStore } from "@/hooks/useLogStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WORK_TYPES } from "@/lib/constants"
import { getMoodEmoji, getWorkTypeEmoji } from "@/lib/utils"

export function SummaryStats() {
  const { logs } = useLogStore()

  // Get logs from the last 7 days
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recentLogs = logs.filter((log) => new Date(log.date) >= sevenDaysAgo)

  // Calculate average energy and meaning levels
  const avgEnergyLevel = recentLogs.length
    ? recentLogs.reduce((sum, log) => sum + log.energyLevel, 0) / recentLogs.length
    : 0

  const avgMeaningLevel = recentLogs.length
    ? recentLogs.reduce((sum, log) => sum + log.meaningLevel, 0) / recentLogs.length
    : 0

  // Find most common mood and work type
  const moodCounts = recentLogs.reduce(
    (acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const workTypeCounts = recentLogs.reduce(
    (acc, log) => {
      acc[log.workType] = (acc[log.workType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral"
  const mostCommonWorkType = Object.entries(workTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "work"

  // Find highest meaning activity
  const highestMeaningLog = [...recentLogs].sort((a, b) => b.meaningLevel - a.meaningLevel)[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>Stats from the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Total Logs</dt>
              <dd className="text-3xl font-bold">{recentLogs.length}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Avg. Energy</dt>
              <dd className="text-3xl font-bold">{avgEnergyLevel.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Avg. Meaning</dt>
              <dd className="text-3xl font-bold">{avgMeaningLevel.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Common Mood</dt>
              <dd className="text-3xl font-bold flex items-center">{getMoodEmoji(mostCommonMood as any)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Insights</CardTitle>
          <CardDescription>What your logs reveal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground">Most Common Activity</h3>
              <p className="flex items-center text-lg font-medium">
                <span className="mr-2">{getWorkTypeEmoji(mostCommonWorkType as any)}</span>
                {WORK_TYPES.find((t) => t.value === mostCommonWorkType)?.label || mostCommonWorkType}
              </p>
            </div>

            {highestMeaningLog && (
              <div>
                <h3 className="font-medium text-muted-foreground">Most Meaningful Activity</h3>
                <p className="text-lg font-medium">{highestMeaningLog.title}</p>
                <p className="text-sm text-muted-foreground">
                  Meaning: {highestMeaningLog.meaningLevel}/5 • Energy: {highestMeaningLog.energyLevel}/5
                </p>
              </div>
            )}

            <div>
              <h3 className="font-medium text-muted-foreground">Recommendation</h3>
              <p className="text-sm">
                {avgMeaningLevel > 3.5
                  ? "You're finding meaning in your activities. Keep it up!"
                  : "Try to focus more on activities that bring you meaning and joy."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
