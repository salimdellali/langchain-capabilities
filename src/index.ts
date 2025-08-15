import * as dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 2,
})

// Create a prompt template
const promptTemplate = PromptTemplate.fromTemplate(
  "Tell me a {adjective} joke about {topic}."
)

// Create an output parser
const outputParser = new StringOutputParser()

// Chain them together
const chain = promptTemplate.pipe(model).pipe(outputParser)

// Use the chain
async function main(): Promise<void> {
  try {
    const result = await chain.invoke({
      adjective: "hilarious", // example adjectives: funny, silly, absurd, hilarious
      topic: "AI", // example topics: programming, AI, cats, Canada
    })

    console.log("AI Response:", result)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
