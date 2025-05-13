import { createClient } from "@supabase/supabase-js"
import type { LogEntry, User, MoodType, WorkType, EnergyLevel, MeaningLevel } from "./types"

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

    if (!authUser) {
      console.log("No authenticated user found")
      return null
    }

    console.log("Auth user found:", authUser)

    // Lấy thông tin chi tiết của user từ database
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email || "")
      .single()

    if (error) {
      console.log("Error fetching user data:", error)
      
      // Nếu lỗi là do không tìm thấy user, tạo mới user
      if (error.code === 'PGRST116') {
        console.log("User not found in database, creating new user...")
        
        // Trích xuất thông tin từ user metadata
        const metadata = authUser.user_metadata || {}
        const newUserData = {
          id: authUser.id,
          email: authUser.email,
          name: metadata.full_name || metadata.name || authUser.email?.split('@')[0],
          avatar_url: metadata.avatar_url || metadata.picture,
          provider: metadata.provider || 'google',
          provider_id: metadata.provider_id,
          email_verified: metadata.email_verified || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        console.log("Attempting to create user with data:", newUserData)

        // Thử tạo user mới
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([newUserData])
          .select()
          .single()

        if (createError) {
          console.error("Error creating user:", {
            message: createError.message,
            code: createError.code,
            details: createError.details,
            hint: createError.hint,
            error: createError,
            userData: newUserData
          })

          // Thử tạo lại với service role key nếu cần
          const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          )

          const { data: adminUser, error: adminError } = await supabaseAdmin
            .from("users")
            .insert([newUserData])
            .select()
            .single()

          if (adminError) {
            console.error("Error creating user with admin:", {
              message: adminError.message,
              code: adminError.code,
              details: adminError.details,
              hint: adminError.hint,
              error: adminError,
              userData: newUserData
            })
            return null
          }

          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            avatar_url: adminUser.avatar_url,
            provider: adminUser.provider,
            provider_id: adminUser.provider_id,
            email_verified: adminUser.email_verified,
            created_at: adminUser.created_at,
            updated_at: adminUser.updated_at,
          } as User
        }

        console.log("New user created successfully:", newUser)

        return {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar_url: newUser.avatar_url,
          provider: newUser.provider,
          provider_id: newUser.provider_id,
          email_verified: newUser.email_verified,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at,
        } as User
      }

      console.error("Error getting user data:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return null
    }

    if (!userData) {
      console.log("No user data found")
      return null
    }

    console.log("Existing user found:", userData)

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar_url: userData.avatar_url,
      provider: userData.provider,
      provider_id: userData.provider_id,
      email_verified: userData.email_verified,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    } as User
  } catch (error) {
    console.error("Unexpected error in getCurrentUser:", error)
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

    return (data || []).map(log => ({
      id: log.id,
      title: log.title,
      description: log.description,
      mood: log.mood as MoodType,
      work_type: log.work_type as WorkType,
      energy_level: log.energy_level as EnergyLevel,
      meaning_level: log.meaning_level as MeaningLevel,
      date: log.date,
      user_id: log.user_id,
      created_at: log.created_at,
      updated_at: log.updated_at,
    })) as LogEntry[]
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

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      mood: data.mood as MoodType,
      work_type: data.work_type as WorkType,
      energy_level: data.energy_level as EnergyLevel,
      meaning_level: data.meaning_level as MeaningLevel,
      date: data.date,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } as LogEntry
  } catch (error) {
    console.error("Error getting log:", error)
    return null
  }
}

export async function createLog(log: Omit<LogEntry, "id" | "created_at" | "updated_at" | "user_id">) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    console.log("Creating log with data:", log)

    const now = new Date().toISOString()
    const logData = {
      ...log,
      user_id: user.id,
      created_at: now,
      updated_at: now,
    }

    console.log("Final log data:", logData)

    const { data, error } = await supabase
      .from("logs")
      .insert([logData])
      .select()

    if (error) {
      console.error("Error creating log:", error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error("Failed to create log: No data returned")
    }

    console.log("Log created successfully:", data[0])

    return {
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      mood: data[0].mood as MoodType,
      work_type: data[0].work_type as WorkType,
      energy_level: data[0].energy_level as EnergyLevel,
      meaning_level: data[0].meaning_level as MeaningLevel,
      date: data[0].date,
      user_id: data[0].user_id,
      created_at: data[0].created_at,
      updated_at: data[0].updated_at,
    } as LogEntry
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

    return {
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      mood: data[0].mood as MoodType,
      work_type: data[0].work_type as WorkType,
      energy_level: data[0].energy_level as EnergyLevel,
      meaning_level: data[0].meaning_level as MeaningLevel,
      date: data[0].date,
      user_id: data[0].user_id,
      created_at: data[0].created_at,
      updated_at: data[0].updated_at,
    } as LogEntry
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
