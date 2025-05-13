"use client"

import { useEffect, useState } from "react"
import type { LogEntry } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"
import { getLogs } from "@/lib/supabase"
import { MoodChart } from "@/components/dashboard/mood-chart"
import { WorkTypeChart } from "@/components/dashboard/work-type-chart"
import { EnergyMeaningMatrix } from "@/components/dashboard/energy-meaning-matrix"
import { SummaryStats } from "@/components/dashboard/summary-stats"
import { WordCloud } from "@/components/dashboard/word-cloud"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLogs() {
      try {
        // Check if user is authenticated first
        const {
          data: { user },
        } = await supabase.auth.getUser()

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

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      {logs.length === 0 ? (
        <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <AlertTitle className="text-lg font-medium">{t("dashboard.noLogsTitle")}</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {supabase.auth.getUser() ? t("dashboard.noLogsDesc") : t("dashboard.notLoggedInDesc")}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Plus className="h-8 w-8 text-primary" />
            </motion.div>
            <h3 className="text-xl font-medium text-center">{t("dashboard.createFirstLog")}</h3>
            <Button asChild size="lg" className="gap-2">
              <Link href="/log/new">
                <Plus className="h-4 w-4" />
                {t("home.createLog")}
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="charts">{t("dashboard.charts")}</TabsTrigger>
            <TabsTrigger value="insights">{t("dashboard.insights")}</TabsTrigger>
            <TabsTrigger value="wordcloud">{t("dashboard.wordCloud")}</TabsTrigger>
            <TabsTrigger value="summary">{t("dashboard.summary")}</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MoodChart logs={logs} />
              <WorkTypeChart logs={logs} />
            </div>
            <EnergyMeaningMatrix logs={logs} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsights logs={logs} />
            <SummaryStats logs={logs} />
          </TabsContent>

          <TabsContent value="wordcloud">
            <WordCloud logs={logs} />
          </TabsContent>

          <TabsContent value="summary">
            <SummaryStats logs={logs} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
