"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLanguage } from "@/contexts/language-context"
import { signIn, signUp } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Cải thiện schema validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("login")

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      await signIn(values.email, values.password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      // Hiển thị thông báo lỗi thân thiện hơn
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else {
        setError(error.message || "Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Thêm xử lý lỗi chi tiết hơn
      const response = await signUp(values.email, values.password, values.name)

      // Kiểm tra xem đăng ký có thành công không
      if (response.user) {
        // Chuyển sang tab đăng nhập nếu đăng ký thành công
        setActiveTab("login")
        setError("Registration successful! Please check your email to confirm your account, then log in.")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Registration failed:", error)

      // Xử lý các loại lỗi cụ thể
      if (error.message.includes("Email address") && error.message.includes("invalid")) {
        setError("The email address format is not accepted. Please use a different email.")
      } else if (error.message.includes("User already registered")) {
        setError("This email is already registered. Please log in or use a different email.")
      } else {
        setError(error.message || "Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{t("app.name")}</CardTitle>
            <CardDescription className="text-center">{t("auth.accountDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant={error.includes("successful") ? "default" : "destructive"}
                className={`mb-4 ${error.includes("successful") ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400" : ""}`}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4 mt-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your@email.com"
                              {...field}
                              className="h-10 border-primary/20 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              {...field}
                              className="h-10 border-primary/20 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          {t("auth.loggingIn")}
                        </div>
                      ) : (
                        t("auth.login")
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 mt-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.name")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="h-10 border-primary/20 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your@email.com"
                              {...field}
                              className="h-10 border-primary/20 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              {...field}
                              className="h-10 border-primary/20 focus-visible:ring-primary/30"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                          {t("auth.creatingAccount")}
                        </div>
                      ) : (
                        t("auth.register")
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
