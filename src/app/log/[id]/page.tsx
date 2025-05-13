"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLogStore } from "@/hooks/useLogStore"
import { LogForm } from "@/components/log/log-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditLogPage() {
  const params = useParams()
  const router = useRouter()
  const { getLog } = useLogStore()
  const [log, setLog] = useState(null)

  const id = params.id as string

  useEffect(() => {
    const foundLog = getLog(id)
    if (foundLog) {
      setLog(foundLog)
    } else {
      router.push("/logs")
    }
  }, [id, getLog, router])

  if (!log) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Log</h1>
          <p className="text-muted-foreground">Update your activity details, emotions, and meaning</p>
        </div>
      </div>

      <LogForm initialData={log} id={id} />
    </div>
  )
}
