export type MoodType = "excited" | "happy" | "neutral" | "tired" | "frustrated" | "sad"

export type WorkType = "work" | "learning" | "personal" | "health" | "social" | "leisure"

export type EnergyLevel = 1 | 2 | 3 | 4 | 5

export type MeaningLevel = 1 | 2 | 3 | 4 | 5

export interface LogEntry {
  id: string
  title: string
  description: string
  mood: MoodType
  work_type: WorkType
  energy_level: EnergyLevel
  meaning_level: MeaningLevel
  date: string // ISO string
  created_at: string // ISO string
  updated_at: string // ISO string
  user_id: string
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  created_at: string
  updated_at: string
}

export interface Word {
  text: string
  value: number
}

export interface MatrixItem {
  x: number
  y: number
  id: string
  title: string
  mood: MoodType
  date: string
}

export type Language = "en" | "vi"
