import { createClient } from "@supabase/supabase-js"
import type { LogEntry, User } from "./types"

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
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  } catch (error: any) {
    console.error("Google sign in error:", error)
    throw error
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return null

    // Lấy thông tin chi tiết của user từ database
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email)
      .single()

    if (error) {
      console.error("Error getting user data:", error)
      return null
    }

    if (!userData) {
      // Nếu user chưa có trong database, tạo mới
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error("Error creating user:", createError)
        return null
      }

      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      } as User
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    } as User
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Log functions
export async function getLogs() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Kiểm tra xem bảng logs đã tồn tại chưa
    const { error: tableCheckError } = await supabase.from("logs").select("*").limit(1).maybeSingle()

    // Nếu bảng chưa tồn tại, tạo bảng
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Creating logs table...")
      return []
    }

    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (error) throw error

    return (data || []) as LogEntry[]
  } catch (error) {
    console.error("Error getting logs:", error)
    return []
  }
}

export async function getLogById(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    return data as LogEntry
  } catch (error) {
    console.error("Error getting log:", error)
    return null
  }
}

export async function createLog(log: Omit<LogEntry, "id" | "created_at" | "updated_at" | "user_id">) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
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
  } catch (error) {
    console.error("Error creating log:", error)
    throw error
  }
}

export async function updateLog(id: string, log: Partial<LogEntry>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
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
  } catch (error) {
    console.error("Error updating log:", error)
    throw error
  }
}

export async function deleteLog(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase
      .from("logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error deleting log:", error)
    throw error
  }
}
