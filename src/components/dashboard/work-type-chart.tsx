"use client"

import { useLogStore } from "@/hooks/useLogStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { WORK_TYPES } from "@/lib/constants"

export function WorkTypeChart() {
  const { logs } = useLogStore()

  // Count logs by work type
  const workTypeCounts = logs.reduce(
    (acc, log) => {
      acc[log.workType] = (acc[log.workType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Prepare data for the chart
  const chartData = WORK_TYPES.map((type) => ({
    name: type.label,
    value: workTypeCounts[type.value] || 0,
    emoji: type.emoji,
  })).filter((item) => item.value > 0)

  // Custom colors for the chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#FF6B6B"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Distribution</CardTitle>
        <CardDescription>Breakdown of your activities by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent, emoji }) => `${emoji} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(value, entry, index) => (
                  <span className="flex items-center">
                    <span className="mr-2">{chartData[index]?.emoji}</span>
                    {value} ({chartData[index]?.value})
                  </span>
                )}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
