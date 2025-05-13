"use client"

import { useState } from "react"
import { useLogStore } from "@/hooks/useLogStore"
import { LogItem } from "./log-item"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOODS, WORK_TYPES } from "@/lib/constants"
import type { MoodType, WorkType } from "@/lib/types"

export function LogList() {
  const { logs } = useLogStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [moodFilter, setMoodFilter] = useState<MoodType | "all">("all")
  const [typeFilter, setTypeFilter] = useState<WorkType | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "energy" | "meaning">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMood = moodFilter === "all" || log.mood === moodFilter
      const matchesType = typeFilter === "all" || log.workType === typeFilter

      return matchesSearch && matchesMood && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "energy") {
        return sortOrder === "asc" ? a.energyLevel - b.energyLevel : b.energyLevel - a.energyLevel
      } else {
        return sortOrder === "asc" ? a.meaningLevel - b.meaningLevel : b.meaningLevel - a.meaningLevel
      }
    })

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={moodFilter} onValueChange={(value) => setMoodFilter(value as MoodType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                {MOODS.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <span className="flex items-center">
                      <span className="mr-2">{mood.emoji}</span>
                      {mood.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as WorkType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {WORK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center">
                      <span className="mr-2">{type.emoji}</span>
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "energy" | "meaning")}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="energy">Energy Level</SelectItem>
                <SelectItem value="meaning">Meaning Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No logs found. Create your first log!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredLogs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}
