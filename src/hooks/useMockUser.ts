import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface UserState {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
  isAuthenticated: boolean
}

export const useMockUser = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo purposes, any email/password combination works
        const user = {
          id: generateId(),
          name: email.split("@")[0],
          email,
        }

        set({ user, isAuthenticated: true })
        return user
      },
      register: async (name, email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const user = {
          id: generateId(),
          name,
          email,
        }

        set({ user, isAuthenticated: true })
        return user
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "meaningful-tracker-user",
    },
  ),
)
