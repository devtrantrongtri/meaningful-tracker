import { createClient } from "@supabase/supabase-js"
import type { LogEntry } from "./types"

// Sử dụng biến môi trường từ Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Tạo singleton client để tránh nhiều instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  }
  return supabaseInstance
})()

// User functions
export async function signUp(email: string, password: string, name: string) {
  try {
    // Kiểm tra xem bảng profiles đã tồn tại chưa
    const { error: tableCheckError } = await supabase.from("profiles").select("*").limit(1).maybeSingle()

    // Nếu bảng chưa tồn tại, tạo bảng
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Creating profiles table...")
      // Trong môi trường thực tế, bạn sẽ tạo bảng thông qua migrations
      // Đây chỉ là giải pháp tạm thời cho demo
    }

    // Đăng ký người dùng
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      throw error
    }

    // Nếu đăng ký thành công, tạo profile cho người dùng
    if (data.user) {
      try {
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            name,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
          // Không throw error ở đây vì đăng ký đã thành công
        }
      } catch (profileError) {
        console.error("Error creating profile:", profileError)
      }
    }

    return data
  } catch (error) {
    console.error("Sign up process error:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Log functions
export async function getLogs() {
  try {
    // Kiểm tra xem bảng logs đã tồn tại chưa
    const { error: tableCheckError } = await supabase.from("logs").select("*").limit(1).maybeSingle()

    // Nếu bảng chưa tồn tại, tạo bảng
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Creating logs table...")
      // Trong môi trường thực tế, bạn sẽ tạo bảng thông qua migrations
      // Đây chỉ là giải pháp tạm thời cho demo
      return []
    }

    const { data, error } = await supabase.from("logs").select("*").order("date", { ascending: false })

    if (error) throw error

    return data as LogEntry[]
  } catch (error) {
    console.error("Error getting logs:", error)
    throw error
  }
}

export async function getLogById(id: string) {
  const { data, error } = await supabase.from("logs").select("*").eq("id", id).single()

  if (error) throw error

  return data as LogEntry
}

export async function createLog(log: Omit<LogEntry, "id" | "created_at" | "updated_at" | "user_id">) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("logs")
    .insert([
      {
        ...log,
        user_id: user.id,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()

  if (error) throw error

  return data[0] as LogEntry
}

export async function updateLog(id: string, log: Partial<LogEntry>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("logs")
    .update({
      ...log,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()

  if (error) throw error

  return data[0] as LogEntry
}

export async function deleteLog(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("logs").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error

  return true
}
