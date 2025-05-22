"use client"

import type React from "react"

import { MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/types"
import { useEffect, useState } from "react"
import CodeBlock from "@/components/code-block"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [formattedContent, setFormattedContent] = useState<React.ReactNode[]>([])

  useEffect(() => {
    if (!isUser) {
      // Process AI responses to format code blocks and steps
      const processContent = () => {
        const content = message.content

        // Check if the content is a simple response (no code blocks or steps)
        if (!content.includes("```") && !content.includes("Step ")) {
          return [
            <div key="simple-response" className="prose prose-invert max-w-none">
              {content}
            </div>,
          ]
        }

        // Split by code blocks
        const parts = content.split(/(```[\s\S]*?```)/g)

        return parts
          .map((part, index) => {
            // Check if this part is a code block
            if (part.startsWith("```") && part.endsWith("```")) {
              // Extract language and code
              const match = part.match(/```(\w+)?\s*([\s\S]*?)```/)
              if (match) {
                const language = match[1] || "javascript"
                const code = match[2].trim()

                return <CodeBlock key={index} language={language} code={code} />
              }
            } else if (part.trim()) {
              // Process numbered steps with icons
              const processedText = part.replace(/Step (\d+):(.*?)(?=Step \d+:|$)/gs, (match, number, content) => {
                return `<div class="step-container"><div class="step-number">${number}</div><div class="step-content">${content.trim()}</div></div>`
              })

              return (
                <div
                  key={index}
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: processedText
                      .replace(/\n/g, "<br />")
                      .replace(/<div class="step-container">/g, '<div class="flex items-start gap-3 my-4">')
                      .replace(
                        /<div class="step-number">(\d+)<\/div>/g,
                        '<div class="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-medium text-sm flex-shrink-0">$1</div>',
                      )
                      .replace(/<div class="step-content">(.*?)<\/div>/g, '<div class="flex-1">$1</div>'),
                  }}
                />
              )
            }

            return null
          })
          .filter(Boolean)
      }

      setFormattedContent(processContent())
    }
  }, [message.content, isUser])

  return (
    <div className={cn("flex items-start gap-4", isUser ? "justify-start" : "justify-start")}>
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          isUser
            ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
            : "bg-gradient-to-br from-purple-400 to-pink-600 text-white",
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </div>

      <div className="flex-1 space-y-2">
        <div className="font-medium">{isUser ? "You" : "Nav's GPT"}</div>
        {isUser ? (
          <div className="prose prose-invert max-w-none">{message.content}</div>
        ) : (
          <div className="space-y-2">{formattedContent}</div>
        )}
      </div>
    </div>
  )
}
