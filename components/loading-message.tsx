import { MessageCircle } from "lucide-react"

export default function LoadingMessage() {
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 text-white">
        <MessageCircle className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="font-medium">Nav's GPT</div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}
