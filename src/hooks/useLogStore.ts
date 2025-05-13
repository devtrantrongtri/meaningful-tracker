import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LogEntry } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface LogState {
  logs: LogEntry[]
  addLog: (log: Omit<LogEntry, "id" | "createdAt" | "updatedAt">) => void
  updateLog: (id: string, log: Partial<LogEntry>) => void
  deleteLog: (id: string) => void
  getLog: (id: string) => LogEntry | undefined
}

export const useLogStore = create<LogState>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (log) => {
        const now = new Date().toISOString()
        const newLog: LogEntry = {
          ...log,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ logs: [newLog, ...state.logs] }))
      },
      updateLog: (id, updatedLog) => {
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === id ? { ...log, ...updatedLog, updatedAt: new Date().toISOString() } : log,
          ),
        }))
      },
      deleteLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }))
      },
      getLog: (id) => {
        return get().logs.find((log) => log.id === id)
      },
    }),
    {
      name: "meaningful-tracker-storage",
    },
  ),
)
