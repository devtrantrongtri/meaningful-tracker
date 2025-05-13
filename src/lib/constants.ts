import type { MoodType, WorkType } from "./types"

export const MOODS: { value: MoodType; label: string; emoji: string }[] = [
  { value: "excited", label: "mood.excited", emoji: "🤩" },
  { value: "happy", label: "mood.happy", emoji: "😊" },
  { value: "neutral", label: "mood.neutral", emoji: "😐" },
  { value: "tired", label: "mood.tired", emoji: "😴" },
  { value: "frustrated", label: "mood.frustrated", emoji: "😤" },
  { value: "sad", label: "mood.sad", emoji: "😔" },
]

export const WORK_TYPES: { value: WorkType; label: string; emoji: string }[] = [
  { value: "work", label: "workType.work", emoji: "💼" },
  { value: "learning", label: "workType.learning", emoji: "📚" },
  { value: "personal", label: "workType.personal", emoji: "🏠" },
  { value: "health", label: "workType.health", emoji: "💪" },
  { value: "social", label: "workType.social", emoji: "👥" },
  { value: "leisure", label: "workType.leisure", emoji: "🎮" },
]

export const ENERGY_LEVELS = [
  { value: 1, label: "energyLevel.1" },
  { value: 2, label: "energyLevel.2" },
  { value: 3, label: "energyLevel.3" },
  { value: 4, label: "energyLevel.4" },
  { value: 5, label: "energyLevel.5" },
]

export const MEANING_LEVELS = [
  { value: 1, label: "meaningLevel.1" },
  { value: 2, label: "meaningLevel.2" },
  { value: 3, label: "meaningLevel.3" },
  { value: 4, label: "meaningLevel.4" },
  { value: 5, label: "meaningLevel.5" },
]
