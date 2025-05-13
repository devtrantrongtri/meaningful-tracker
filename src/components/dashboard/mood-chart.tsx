"use client"

import { useLogStore } from "@/hooks/useLogStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { getMoodEmoji } from "@/lib/utils"

export function MoodChart() {
  const { logs } = useLogStore()

  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Map mood to numeric value for the chart
  const moodToValue = {
    excited: 5,
    happy: 4,
    neutral: 3,
    tired: 2,
    frustrated: 1,
    sad: 0,
  }

  const chartData = sortedLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString(),
    mood: moodToValue[log.mood],
    moodLabel: log.mood,
    title: log.title,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Track how your mood changes over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            mood: {
              label: "Mood",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.split("/").slice(0, 2).join("/")}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tickFormatter={(value) => {
                  const moodLabels = ["sad", "frustrated", "tired", "neutral", "happy", "excited"]
                  return getMoodEmoji(moodLabels[value] as any)
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      const moodLabels = ["sad", "frustrated", "tired", "neutral", "happy", "excited"]
                      return [moodLabels[value as number], "Mood"]
                    }}
                  />
                }
              />
              <Line type="monotone" dataKey="mood" stroke="var(--color-mood)" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
