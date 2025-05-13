"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { LogEntry } from "@/lib/types"
import { useLogStore } from "@/hooks/useLogStore"
import {
  formatDate,
  getColorByMood,
  getColorByWorkType,
  getMoodEmoji,
  getRelativeTime,
  getWorkTypeEmoji,
} from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface LogItemProps {
  log: LogEntry
}

export function LogItem({ log }: LogItemProps) {
  const router = useRouter()
  const { deleteLog } = useLogStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    deleteLog(log.id)
    setIsDeleting(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{log.title}</CardTitle>
              <CardDescription>{formatDate(log.date)}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className={`${getColorByMood(log.mood)} text-white`}>
                {getMoodEmoji(log.mood)} {log.mood}
              </Badge>
              <Badge variant="outline" className={`${getColorByWorkType(log.workType)} text-white`}>
                {getWorkTypeEmoji(log.workType)} {log.workType}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-line">{log.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Energy Level</span>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-2 rounded-full mr-1 ${
                      i < log.energyLevel ? "bg-orange-500 dark:bg-orange-400" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Meaning Level</span>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-2 rounded-full mr-1 ${
                      i < log.meaningLevel ? "bg-purple-500 dark:bg-purple-400" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">Created {getRelativeTime(log.createdAt)}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/log/${log.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your log entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
