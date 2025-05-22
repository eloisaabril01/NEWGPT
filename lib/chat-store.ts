import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Message } from "./types"

interface Chat {
  title: string
  messages: Message[]
  createdAt: number
}

interface ChatStore {
  chats: Record<string, Chat>
  currentChat: string | null
  createChat: (id: string) => void
  setCurrentChat: (id: string) => void
  addMessage: (chatId: string, message: Message) => void
  updateChatTitle: (chatId: string, title: string) => void
  deleteChat: (chatId: string) => void
}

// Create a function to get the storage key based on user ID
const getStorageKey = () => {
  // Get the user ID from the user store if available, or use a default
  let userId = "default-user"
  try {
    // This is a bit of a hack to access the user store outside of a component
    const userState = JSON.parse(localStorage.getItem("navs-gpt-user-store") || "{}")
    userId = userState?.state?.preferences?.userId || "default-user"
  } catch (e) {
    console.error("Error accessing user store:", e)
  }
  return `navs-gpt-chat-store-${userId}`
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: {},
      currentChat: null,

      createChat: (id) =>
        set((state) => ({
          chats: {
            ...state.chats,
            [id]: {
              title: "New Chat",
              messages: [],
              createdAt: Date.now(),
            },
          },
          currentChat: id,
        })),

      setCurrentChat: (id) => set({ currentChat: id }),

      addMessage: (chatId, message) =>
        set((state) => {
          // Only update if the chat exists
          if (!state.chats[chatId]) return state

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                messages: [...state.chats[chatId].messages, message],
              },
            },
          }
        }),

      updateChatTitle: (chatId, title) =>
        set((state) => {
          // Only update if the chat exists and title is different
          if (!state.chats[chatId] || state.chats[chatId].title === title) return state

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                title,
              },
            },
          }
        }),

      deleteChat: (chatId) =>
        set((state) => {
          const { [chatId]: _, ...remainingChats } = state.chats
          return {
            chats: remainingChats,
            currentChat: state.currentChat === chatId ? null : state.currentChat,
          }
        }),
    }),
    {
      name: getStorageKey(),
      // Store in localStorage to persist until browser refresh
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          return JSON.parse(str)
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    },
  ),
)
