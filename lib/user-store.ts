import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserPreferences {
  userId: string
  theme: "light" | "dark"
  fontSize: "small" | "medium" | "large"
  notifications: boolean
}

interface UserStore {
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void
}

// Generate a random user ID if one doesn't exist
const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      preferences: {
        userId: generateUserId(),
        theme: "dark",
        fontSize: "medium",
        notifications: true,
      },
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),
    }),
    {
      name: "navs-gpt-user-store",
    },
  ),
)
