import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Kiểm tra và xóa user trong auth
    const { data: { users }, error: authListError } = await supabase.auth.admin.listUsers()
    if (authListError) {
      console.error("Error checking auth users:", authListError)
      return NextResponse.json({ error: "Failed to check auth users" }, { status: 500 })
    }

    // Nếu email đã tồn tại trong auth nhưng chưa xác nhận, xóa user cũ
    const existingAuthUser = users?.find(u => u.email === email)
    if (existingAuthUser && !existingAuthUser.email_confirmed_at) {
      await supabase.auth.admin.deleteUser(existingAuthUser.id)
    }

    // Xóa user trong database
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("email", email)

    if (deleteError) {
      console.error("Error deleting user:", deleteError)
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Reset error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 