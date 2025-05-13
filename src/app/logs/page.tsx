"use client"

import { useEffect, useState } from "react"
import type { LogEntry, MoodType, WorkType } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import { deleteLog, getLogs } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOODS, WORK_TYPES } from "@/lib/constants"
import { Plus } from "lucide-react"
import Link from "next/link"
import { EmotionCard } from "@/components/log/emotion-card"
import { MatrixView } from "@/components/log/matrix-view"
import { TimelineView } from "@/components/log/timeline-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookText } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function LogsPage() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [moodFilter, setMoodFilter] = useState<MoodType | "all">("all")
  const [typeFilter, setTypeFilter] = useState<WorkType | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "energy" | "meaning">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [logToDelete, setLogToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLogs() {
      try {
        // Check if user is authenticated first
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setLogs([])
          setLoading(false)
          return
        }

        // Try to get logs, handle case when table doesn't exist
        try {
          const data = await getLogs()
          setLogs(data || [])
        } catch (error: any) {
          console.error("Error fetching logs:", error)
          // Check if the error is about missing table
          if (error.message && error.message.includes("does not exist")) {
            setLogs([])
          } else {
            setError("Failed to load logs. Please try again later.")
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  useEffect(() => {
    // Filter and sort logs
    let filtered = [...logs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply mood filter
    if (moodFilter !== "all") {
      filtered = filtered.filter((log) => log.mood === moodFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.work_type === typeFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "energy") {
        return sortOrder === "asc" ? a.energy_level - b.energy_level : b.energy_level - a.energy_level
      } else {
        return sortOrder === "asc" ? a.meaning_level - b.meaning_level : b.meaning_level - a.meaning_level
      }
    })

    setFilteredLogs(filtered)
  }, [logs, searchTerm, moodFilter, typeFilter, sortBy, sortOrder])

  const handleDeleteLog = async (id: string) => {
    setLogToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!logToDelete) return

    setIsDeleting(true)
    try {
      await deleteLog(logToDelete)
      setLogs(logs.filter((log) => log.id !== logToDelete))
    } catch (error) {
      console.error("Error deleting log:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setLogToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-12 w-full mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("logs.title")}</h1>
          <p className="text-muted-foreground">{t("logs.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/log/new" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("logs.newLog")}
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder={t("logs.searchLogs")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={moodFilter} onValueChange={(value) => setMoodFilter(value as MoodType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder={t("logs.filterByMood")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("logs.allMoods")}</SelectItem>
                {MOODS.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <span className="flex items-center">
                      <span className="mr-2">{mood.emoji}</span>
                      {t(mood.label)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as WorkType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder={t("logs.filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("logs.allTypes")}</SelectItem>
                {WORK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center">
                      <span className="mr-2">{type.emoji}</span>
                      {t(type.label)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "energy" | "meaning")}>
              <SelectTrigger>
                <SelectValue placeholder={t("logs.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">{t("logs.date")}</SelectItem>
                <SelectItem value="energy">{t("logs.energy")}</SelectItem>
                <SelectItem value="meaning">{t("logs.meaning")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
              <SelectTrigger>
                <SelectValue placeholder={t("logs.sortOrder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("logs.newestFirst")}</SelectItem>
                <SelectItem value="asc">{t("logs.oldestFirst")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredLogs.length === 0 ? (
        <div className="space-y-6 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <BookText className="h-10 w-10 text-primary" />
            </motion.div>

            <h3 className="text-xl font-medium mb-2">
              {supabase.auth.getUser() ? t("logs.noLogsFound") : t("logs.notLoggedIn")}
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {supabase.auth.getUser() ? t("logs.createFirstLogDesc") : t("logs.loginToViewLogs")}
            </p>

            <div className="flex gap-4">
              {!supabase.auth.getUser() && (
                <Button asChild variant="outline">
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/log/new" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("logs.newLog")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="cards">{t("logs.cardsView")}</TabsTrigger>
            <TabsTrigger value="matrix">{t("logs.matrixView")}</TabsTrigger>
            <TabsTrigger value="timeline">{t("logs.timelineView")}</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLogs.map((log) => (
                <EmotionCard key={log.id} log={log} onDelete={handleDeleteLog} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <MatrixView logs={filteredLogs} onDelete={handleDeleteLog} />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineView logs={filteredLogs} onDelete={handleDeleteLog} />
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("logs.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("logs.deleteWarning")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("logs.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? t("logs.deleting") : t("logs.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
