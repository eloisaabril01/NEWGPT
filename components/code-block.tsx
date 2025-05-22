"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  language: string
  code: string
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-md overflow-hidden bg-gray-950 border border-gray-800">
      <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-xs text-gray-200">
        <span>{language}</span>
        <button
          className="text-gray-400 hover:text-white flex items-center gap-1"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  )
}
