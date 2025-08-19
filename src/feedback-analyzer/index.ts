import * as dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { readFeedback, saveAnalysis } from "./services/fileService.js"
import { executePipeline } from "./services/orchestrator.js"

// LLM Configuration
const createLLM = (): ChatGoogleGenerativeAI => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required")
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    temperature: 0.3,
    apiKey: process.env.GEMINI_API_KEY,
  })
}

const analyzeFeedback = async (feedbackPath: string) => {
  if (!feedbackPath) {
    console.log("❌ Please provide feedback file path")
    console.log("Usage: npm start input/negative-feedback.txt")
    process.exit(1)
  }

  console.log("🚀 LangChain.js Feedback Analysis")

  try {
    const llm = createLLM()
    const filename = feedbackPath.split("/").pop() || feedbackPath
    const feedback = await readFeedback(filename)

    console.log(`📄 Processing: ${feedbackPath}`)
    const analysis = await executePipeline(feedback, llm)

    const outputPath = await saveAnalysis(analysis)
    console.log(`✅ Analysis complete: ${outputPath}`)

    return { analysis, outputPath }
  } catch (error) {
    console.error("❌ Error:", (error as Error).message)
    process.exit(1)
  }
}

// Main execution
const main = async () => {
  const feedbackPath = process.argv[2]
  await analyzeFeedback(feedbackPath)
}

main().catch(console.error)
