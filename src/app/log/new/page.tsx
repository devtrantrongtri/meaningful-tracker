import { LogForm } from "@/components/log/log-form"

export default function NewLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Log</h1>
        <p className="text-muted-foreground">
          Record your activity along with how it made you feel and its meaning to you
        </p>
      </div>

      <LogForm />
    </div>
  )
}
