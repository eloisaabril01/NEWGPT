"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { SendIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChatStore } from "@/lib/chat-store"
import { useUserStore } from "@/lib/user-store"
import { sendMessage } from "@/lib/chat-service"
import ChatMessage from "@/components/chat-message"
import LoadingMessage from "@/components/loading-message"

interface ChatWindowProps {
  chatId: string
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { chats, addMessage, updateChatTitle } = useChatStore()
  const { preferences } = useUserStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const chat = chats[chatId]
  const messages = chat?.messages || []

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Set chat title based on first user message if not already set
    // Only run when messages change and title is not set
    if (chat && chat.title === "New Chat" && messages.length > 0) {
      const firstUserMessage = messages.find((m) => m.role === "user")
      if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
        updateChatTitle(chatId, title)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]) // Only depend on messages.length, not the entire messages array or chat

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // Add user message to chat
    addMessage(chatId, { role: "user", content: userMessage })

    setIsLoading(true)

    try {
      // Get previous messages to provide context
      const previousMessages = messages.slice(-10) // Use last 10 messages for context

      // Send message to API with conversation history
      const response = await sendMessage(userMessage, previousMessages)

      // Add AI response to chat
      addMessage(chatId, { role: "assistant", content: response })
    } catch (error) {
      console.error("Error sending message:", error)
      // This shouldn't happen now since sendMessage handles errors internally,
      // but keeping as a fallback
      addMessage(chatId, {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }

  // Get font size class based on user preferences
  const getFontSizeClass = () => {
    switch (preferences.fontSize) {
      case "small":
        return "text-sm"
      case "large":
        return "text-lg"
      default:
        return "text-base"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 overflow-y-auto p-4 ${getFontSizeClass()}`}>
        {messages.length === 0 ? (
          <motion.div
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Welcome to Nav's GPT
              </h2>
              <p className="text-gray-400 mb-6">
                Ask me anything and I'll do my best to assist you. I can help with general questions, math, coding, and
                more!
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["What is 10+10?", "Tell me a joke", "Write a Python function", "Explain quantum physics"].map(
                  (suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      className="text-sm border-gray-700 hover:bg-gray-800"
                      onClick={() => {
                        setInput(suggestion)
                        if (textareaRef.current) {
                          textareaRef.current.focus()
                        }
                      }}
                    >
                      {suggestion}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingMessage />
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <motion.div
        className="border-t border-gray-800 p-4 bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Nav's GPT..."
              className="pr-12 resize-none min-h-[60px] max-h-[200px] overflow-y-auto bg-gray-800 border-gray-700 focus:border-purple-500 rounded-xl"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
              disabled={!input.trim() || isLoading}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
