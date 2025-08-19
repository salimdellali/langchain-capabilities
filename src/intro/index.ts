import * as dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 1, // 1 for most creative
})

// Create a prompt template
const promptTemplate = PromptTemplate.fromTemplate(
  "Share an interesting fact about {topic} in {nbWords} words."
)

// Create an output parser
const stringOutputParser = new StringOutputParser()

// Chain them together
const chain = promptTemplate.pipe(model).pipe(stringOutputParser)

// Use the chain
async function main(): Promise<void> {
  try {
    const result = await chain.invoke({
      topic: "French colonization of Algeria",
      nbWords: 20,
    })

    console.log("AI Response:")
    console.log(result)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
