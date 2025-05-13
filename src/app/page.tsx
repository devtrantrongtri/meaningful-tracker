"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart, BookText, Plus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { t } = useLanguage()

  // Sample data for the matrix visualization
  const sampleMatrixData = [
    { x: 20, y: 80, emoji: "😤", title: "Stressful Meeting" },
    { x: 80, y: 80, emoji: "🤩", title: "Completed Project" },
    { x: 30, y: 30, emoji: "😔", title: "Boring Task" },
    { x: 70, y: 20, emoji: "😊", title: "Reading Book" },
  ]

  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center">
      <motion.div
        className="space-y-6 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t("home.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">{t("home.subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
            <Link href="/log/new">
              <Plus className="h-5 w-5" />
              {t("home.createLog")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 border-primary text-primary hover:bg-primary/10">
            <Link href="/dashboard">
              <BarChart className="h-5 w-5" />
              {t("home.viewDashboard")}
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Sample Matrix Visualization */}
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20">
          <CardContent className="p-0">
            <div className="relative h-[300px] border-b border-l rounded-md bg-gradient-to-br from-background/50 to-background">
              {/* Gradient backgrounds for quadrants */}
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-500/10 dark:bg-red-500/20 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500/10 dark:bg-green-500/20 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-500/10 dark:bg-orange-500/20 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/10 dark:bg-blue-500/20 rounded-br-md"></div>

              {/* Grid lines */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-muted-foreground/20"></div>
              <div className="absolute top-0 left-1/2 w-px h-full bg-muted-foreground/20"></div>

              {/* Axis labels with improved styling */}
              <div className="absolute bottom-2 left-0 w-full text-center text-xs font-medium text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                  {t("meaningLevel.1")}
                </span>
              </div>
              <div className="absolute bottom-2 right-0 w-full text-center text-xs font-medium text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                  {t("meaningLevel.5")}
                </span>
              </div>
              <div
                className="absolute top-0 left-0 h-full text-xs font-medium text-muted-foreground flex items-center"
                style={{ transform: "rotate(-90deg)", transformOrigin: "left center", marginLeft: "10px" }}
              >
                <span className="px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                  {t("energyLevel.5")}
                </span>
              </div>
              <div
                className="absolute bottom-0 left-0 h-full text-xs font-medium text-muted-foreground flex items-center"
                style={{ transform: "rotate(-90deg)", transformOrigin: "left center", marginLeft: "10px" }}
              >
                <span className="px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                  {t("energyLevel.1")}
                </span>
              </div>

              {/* Quadrant labels with improved styling */}
              <div className="absolute top-6 left-6 text-xs font-bold">
                <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-600 dark:text-red-400 shadow-sm">
                  {t("dashboard.highEnergyLowMeaning")}
                </span>
              </div>
              <div className="absolute top-6 right-6 text-xs font-bold">
                <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-600 dark:text-green-400 shadow-sm">
                  {t("dashboard.highEnergyHighMeaning")}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 text-xs font-bold">
                <span className="px-2 py-1 rounded-md bg-orange-500/20 text-orange-600 dark:text-orange-400 shadow-sm">
                  {t("dashboard.lowEnergyLowMeaning")}
                </span>
              </div>
              <div className="absolute bottom-6 right-6 text-xs font-bold">
                <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm">
                  {t("dashboard.lowEnergyHighMeaning")}
                </span>
              </div>

              {/* Sample data points with improved animations */}
              {sampleMatrixData.map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${item.x}%`,
                    top: `${100 - item.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + index * 0.15,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{
                    scale: 1.3,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="flex flex-col items-center group">
                    <motion.div
                      className="text-3xl filter drop-shadow-md"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 2,
                        delay: index * 0.5,
                      }}
                    >
                      {item.emoji}
                    </motion.div>
                    <div className="text-xs max-w-[100px] truncate text-center mt-1 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity shadow-sm">
                      {item.title}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <motion.div
          className="flex flex-col items-center space-y-4 p-6 border rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="p-3 rounded-full bg-primary/10">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold">{t("home.logActivities")}</h2>
          <p className="text-muted-foreground text-center">{t("home.logActivitiesDesc")}</p>
          <Button asChild variant="link" className="mt-auto">
            <Link href="/log/new" className="gap-2">
              {t("home.createLog")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col items-center space-y-4 p-6 border rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="p-3 rounded-full bg-secondary/10">
            <BookText className="h-6 w-6 text-secondary" />
          </div>
          <h2 className="text-xl font-bold">{t("home.reviewLogs")}</h2>
          <p className="text-muted-foreground text-center">{t("home.reviewLogsDesc")}</p>
          <Button asChild variant="link" className="mt-auto">
            <Link href="/logs" className="gap-2">
              {t("logs.title")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col items-center space-y-4 p-6 border rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="p-3 rounded-full bg-accent/10">
            <BarChart className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-xl font-bold">{t("home.analyzePatterns")}</h2>
          <p className="text-muted-foreground text-center">{t("home.analyzePatternsDesc")}</p>
          <Button asChild variant="link" className="mt-auto">
            <Link href="/dashboard" className="gap-2">
              {t("dashboard.title")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
