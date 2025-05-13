"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { LogEntry } from "@/lib/types"
import { ENERGY_LEVELS, MEANING_LEVELS, MOODS, WORK_TYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { createLog, updateLog } from "@/lib/supabase"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  mood: z.enum(["excited", "happy", "neutral", "tired", "frustrated", "sad"]),
  work_type: z.enum(["work", "learning", "personal", "health", "social", "leisure"]),
  energy_level: z.coerce.number().min(1).max(5),
  meaning_level: z.coerce.number().min(1).max(5),
  date: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface LogFormProps {
  initialData?: Partial<LogEntry>
  id?: string
}

export function LogForm({ initialData, id }: LogFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<FormValues> = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    mood: initialData?.mood || "neutral",
    work_type: initialData?.work_type || "work",
    energy_level: initialData?.energy_level || 3,
    meaning_level: initialData?.meaning_level || 3,
    date: initialData?.date || new Date().toISOString().split("T")[0],
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      if (id) {
        await updateLog(id, values)
      } else {
        await createLog(values)
      }

      // Thêm một chút delay để hiển thị trạng thái đang xử lý
      await new Promise((resolve) => setTimeout(resolve, 800))

      router.push("/logs")
    } catch (error) {
      console.error("Error saving log:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-primary/20 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

        <CardHeader className="pb-4 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <CardTitle className="text-2xl font-bold">{id ? t("logForm.editTitle") : t("logForm.createTitle")}</CardTitle>
          <CardDescription>{t("logForm.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{t("logForm.title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("logForm.titlePlaceholder")}
                        {...field}
                        className="h-12 text-base border-primary/20 focus-visible:ring-primary/30"
                      />
                    </FormControl>
                    <FormDescription>{t("logForm.titleDesc")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{t("logForm.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("logForm.descriptionPlaceholder")}
                        className="min-h-[150px] text-base border-primary/20 focus-visible:ring-primary/30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("logForm.descriptionDesc")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-muted/30 border border-muted">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t("logForm.feelingsSection")}
                  </h3>

                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t("logForm.mood")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base border-primary/20">
                              <SelectValue placeholder={t("logForm.selectMood")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MOODS.map((mood) => (
                              <SelectItem key={mood.value} value={mood.value} className="h-10 text-base">
                                <span className="flex items-center">
                                  <span className="mr-2 text-xl">{mood.emoji}</span>
                                  {t(mood.label)}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>{t("logForm.moodDesc")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="energy_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t("logForm.energyLevel")}</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base border-primary/20">
                                <SelectValue placeholder={t("logForm.selectEnergyLevel")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ENERGY_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={String(level.value)} className="h-10 text-base">
                                  {t(level.label)} ({level.value})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="pt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{t("energyLevel.1")}</span>
                              <span>{t("energyLevel.5")}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                                style={{ width: `${(Number(field.value) / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <FormDescription>{t("logForm.energyLevelDesc")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {t("logForm.activitySection")}
                  </h3>

                  <FormField
                    control={form.control}
                    name="work_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t("logForm.activityType")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base border-primary/20">
                              <SelectValue placeholder={t("logForm.selectActivityType")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {WORK_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="h-10 text-base">
                                <span className="flex items-center">
                                  <span className="mr-2 text-xl">{type.emoji}</span>
                                  {t(type.label)}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>{t("logForm.activityTypeDesc")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meaning_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">{t("logForm.meaningLevel")}</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base border-primary/20">
                                <SelectValue placeholder={t("logForm.selectMeaningLevel")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MEANING_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={String(level.value)} className="h-10 text-base">
                                  {t(level.label)} ({level.value})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="pt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{t("meaningLevel.1")}</span>
                              <span>{t("meaningLevel.5")}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${(Number(field.value) / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <FormDescription>{t("logForm.meaningLevelDesc")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{t("logForm.date")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-12 text-base border-primary/20 focus-visible:ring-primary/30"
                      />
                    </FormControl>
                    <FormDescription>{t("logForm.dateDesc")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0 pt-6 flex justify-end">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        {id ? t("logForm.updating") : t("logForm.creating")}
                      </div>
                    ) : id ? (
                      t("logForm.update")
                    ) : (
                      t("logForm.create")
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
