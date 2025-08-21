import * as dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { AzureChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"

// Initialize the llm
const geminiLLM = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 1, // 1 for most creative
})

const azureOpenAILLM = new AzureChatOpenAI({
  model: "gpt-4.1",
  temperature: 1,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
})

// Create a prompt template
const promptTemplate = PromptTemplate.fromTemplate(
  "Share an interesting fact about {topic} in {nbWords} words."
)

// Create an output parser
const stringOutputParser = new StringOutputParser()

// Chain them together
const chain = promptTemplate.pipe(azureOpenAILLM).pipe(stringOutputParser)

// Use the chain
async function main(): Promise<void> {
  try {
    const result = await chain.invoke({
      topic: "French colonization of Algeria",
      nbWords: 20,
    })

    console.log("LLM Response:")
    console.log(result)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
