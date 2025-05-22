/**
 * Service for handling chat API requests
 */

export async function sendMessage(
  text: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
): Promise<string> {
  try {
    // Create a context string from previous messages to help AI stay on topic
    let contextString = ""

    if (conversationHistory.length > 0) {
      // Format the conversation history to provide context
      contextString = conversationHistory
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      // Add the current message to the context with instructions to be versatile
      contextString +=
        `\nUser: ${text}\n\n` +
        `Please continue this conversation and stay on topic. ` +
        `Respond naturally based on the type of question. ` +
        `For simple questions like math, general knowledge, or casual conversation, ` +
        `provide direct answers without code examples unless specifically requested. ` +
        `Only use code formatting and step-by-step technical explanations for programming or technical questions.`
    } else {
      // First message in conversation
      contextString =
        text +
        `\n\nPlease respond naturally based on the type of question. ` +
        `For simple questions like math, general knowledge, or casual conversation, ` +
        `provide direct answers without code examples unless specifically requested. ` +
        `Only use code formatting and step-by-step technical explanations for programming or technical questions.`
    }

    // Use our internal API route instead of calling the external API directly
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: contextString }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Add error handling for missing response
    if (!data || !data.response) {
      return "No response received from the API"
    }

    return data.response
  } catch (error) {
    console.error("Error in sendMessage:", error)
    // Return a user-friendly error message instead of throwing
    return "Sorry, I couldn't process your request. Please try again later."
  }
}
