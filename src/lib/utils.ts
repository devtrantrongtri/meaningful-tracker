import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MoodType, WorkType } from "./types"
import { MOODS, WORK_TYPES } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getMoodEmoji(mood: MoodType) {
  return MOODS.find((m) => m.value === mood)?.emoji || "😐"
}

export function getWorkTypeEmoji(workType: WorkType) {
  return WORK_TYPES.find((w) => w.value === workType)?.emoji || "💼"
}

export function getColorByMood(mood: MoodType) {
  const moodColors = {
    excited: "bg-accent text-accent-foreground",
    happy: "bg-secondary text-secondary-foreground",
    neutral: "bg-primary text-primary-foreground",
    tired: "bg-highlight text-highlight-foreground",
    frustrated: "bg-orange-500 dark:bg-orange-600 text-white",
    sad: "bg-red-500 dark:bg-red-600 text-white",
  }

  return moodColors[mood] || "bg-gray-500 dark:bg-gray-600 text-white"
}

export function getColorByWorkType(workType: WorkType) {
  const workTypeColors = {
    work: "bg-primary text-primary-foreground",
    learning: "bg-secondary text-secondary-foreground",
    personal: "bg-accent text-accent-foreground",
    health: "bg-red-500 dark:bg-red-600 text-white",
    social: "bg-highlight text-highlight-foreground",
    leisure: "bg-pink-500 dark:bg-pink-600 text-white",
  }

  return workTypeColors[workType] || "bg-gray-500 dark:bg-gray-600 text-white"
}

export function getRelativeTime(date: string | Date) {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else {
    return formatDate(date)
  }
}

export function extractKeywords(text: string): string[] {
  if (!text) return []

  // Remove common words and punctuation
  const commonWords = [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "about",
    "of",
    "by",
    "is",
    "was",
    "were",
    "am",
    "are",
    "been",
    "being",
    "be",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "my",
    "your",
    "his",
    "her",
    "its",
    "our",
    "their",
    "this",
    "that",
    "these",
    "those",
    "do",
    "does",
    "did",
    "doing",
    "done",
    "have",
    "has",
    "had",
    "having",
    "can",
    "could",
    "will",
    "would",
    "shall",
    "should",
    "may",
    "might",
    "must",
    "very",
    "too",
    "so",
    "quite",
    "rather",
  ]

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.includes(word))

  return words
}

export function getWordFrequency(texts: string[]): Record<string, number> {
  const wordFreq: Record<string, number> = {}

  texts.forEach((text) => {
    const keywords = extractKeywords(text)
    keywords.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })
  })

  return wordFreq
}

export function getTopWords(wordFreq: Record<string, number>, limit = 50): { text: string; value: number }[] {
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([text, value]) => ({ text, value }))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}
