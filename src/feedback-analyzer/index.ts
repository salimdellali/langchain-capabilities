import * as dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { AzureChatOpenAI } from "@langchain/openai"
import { readFeedback, saveAnalysis } from "./services/fileService.js"
import { executePipeline } from "./services/orchestrator.js"

// Gemini Configuration
const createGeminiLLM = (): ChatGoogleGenerativeAI => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required")
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.3,
    apiKey: process.env.GEMINI_API_KEY,
  })
}

// Azure OpenAI Configuration
const createAzureOpenAILLM = (): AzureChatOpenAI => {
  if (
    !process.env.AZURE_OPENAI_API_KEY ||
    !process.env.AZURE_OPENAI_INSTANCE_NAME ||
    !process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
    !process.env.AZURE_OPENAI_API_VERSION
  ) {
    throw new Error(
      "AZURE_OPENAI_API_KEY, AZURE_OPENAI_INSTANCE_NAME, AZURE_OPENAI_DEPLOYMENT_NAME and AZURE_OPENAI_API_VERSION environment variables are required"
    )
  }

  return new AzureChatOpenAI({
    model: "gpt-4.1",
    temperature: 0.3,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  })
}

const analyzeFeedback = async (feedbackFile: string) => {
  if (!feedbackFile) {
    console.log("❌ Please provide feedback file")
    console.log("Usage: npm run:feedback negative-feedback.txt")
    process.exit(1)
  }

  console.log("🦜🔗 LangChain.js Feedback Analysis")

  try {
    const llm = createGeminiLLM()
    const feedback = await readFeedback(feedbackFile)

    console.log(`📄 Processing: ${feedbackFile}`)
    const analysis = await executePipeline(feedback, llm)

    const outputPath = await saveAnalysis(analysis)
    console.log(`✅ Analysis complete: ${outputPath}`)
  } catch (error) {
    console.error("❌ Error:", (error as Error).message)
    process.exit(1)
  }
}

// Main execution
const main = async () => {
  const feedbackFile = process.argv[2]
  await analyzeFeedback(feedbackFile)
}

main().catch(console.error)
