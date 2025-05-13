"use client"

import { useLogStore } from "@/hooks/useLogStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ZAxis } from "recharts"
import { getMoodEmoji } from "@/lib/utils"

export function EnergyMeaningMatrix() {
  const { logs } = useLogStore()

  // Prepare data for the chart
  const chartData = logs.map((log) => ({
    x: log.energyLevel,
    y: log.meaningLevel,
    z: 1,
    title: log.title,
    mood: log.mood,
    moodEmoji: getMoodEmoji(log.mood),
    date: new Date(log.date).toLocaleDateString(),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy vs. Meaning Matrix</CardTitle>
        <CardDescription>Visualize the relationship between energy spent and meaning gained</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="x"
                name="Energy"
                domain={[0, 6]}
                label={{ value: "Energy Level", position: "bottom" }}
                ticks={[1, 2, 3, 4, 5]}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Meaning"
                domain={[0, 6]}
                label={{ value: "Meaning Level", angle: -90, position: "left" }}
                ticks={[1, 2, 3, 4, 5]}
              />
              <ZAxis type="number" dataKey="z" range={[60, 400]} />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      if (name === "x") return [value, "Energy Level"]
                      if (name === "y") return [value, "Meaning Level"]
                      return [value, name]
                    }}
                    labelFormatter={(label) => {
                      const item = chartData[label]
                      return `${item.title} ${item.moodEmoji}`
                    }}
                  />
                }
              />
              <Scatter
                name="Activities"
                data={chartData}
                fill="#8884d8"
                shape={(props) => {
                  const { cx, cy, payload } = props
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
                      {payload.moodEmoji}
                    </text>
                  )
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
