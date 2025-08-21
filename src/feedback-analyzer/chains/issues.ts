import { z } from "zod"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "langchain/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import type { AzureChatOpenAI } from "@langchain/openai"
import type { Sentiment } from "./sentiment.js"

// Prompt
const issuesPrompt = PromptTemplate.fromTemplate(`
You are a business analyst specializing in customer experience. 
Identify and categorize all issues from this customer feedback.

Focus on:
- Actionable problems the company can solve
- Root causes, not just symptoms  
- Business impact and customer experience effects
- Specific operational failures

Original Feedback: {feedback}
Sentiment Analysis: {sentimentAnalysis}

{formatInstructions}
`)

// Schema
const IssuesSchema = z.object({
  issues: z
    .array(
      z.object({
        category: z
          .enum(["product", "service", "delivery", "billing", "other"])
          .describe("Issue category"),
        description: z.string().describe("Clear description of the issue"),
        severity: z
          .enum(["low", "medium", "high", "critical"])
          .describe("Business impact severity level"),
      })
    )
    .describe("List of identified issues"),
  primaryConcern: z
    .string()
    .describe("The most critical issue that needs immediate attention"),
})

export type Issues = z.infer<typeof IssuesSchema>

type IssuesRunnableInput = { feedback: string; sentimentAnalysis: Sentiment }

// Runnable
export const createIssuesRunnable = (
  llm: ChatGoogleGenerativeAI | AzureChatOpenAI
) => {
  const outputParser = StructuredOutputParser.fromZodSchema(IssuesSchema)
  const formatInstructions = outputParser.getFormatInstructions()

  return RunnableSequence.from([
    {
      feedback: (input: IssuesRunnableInput) => input.feedback,
      sentimentAnalysis: (input: IssuesRunnableInput) =>
        JSON.stringify(input.sentimentAnalysis),
      formatInstructions: () => formatInstructions,
    },
    issuesPrompt,
    llm,
    outputParser,
  ])
}
