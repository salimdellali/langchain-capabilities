import { z } from "zod"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "langchain/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import type { Sentiment } from "./sentiment.js"

// Schema
export const IssuesSchema = z.object({
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

// Prompt
const issuesPrompt = PromptTemplate.fromTemplate(`
You are a business analyst specializing in customer experience. Identify and categorize all issues from this customer feedback.

Focus on:
- Actionable problems the company can solve
- Root causes, not just symptoms  
- Business impact and customer experience effects
- Specific operational failures

Original Feedback: {feedback}
Sentiment Analysis: {sentiment_analysis}

{format_instructions}
`)

type IssuesInput = { feedback: string; sentiment_analysis: Sentiment }

// Runnable
export const createIssuesRunnable = (llm: ChatGoogleGenerativeAI) => {
  const outputParser = StructuredOutputParser.fromZodSchema(IssuesSchema)
  const formatInstructions = outputParser.getFormatInstructions()

  return RunnableSequence.from([
    {
      feedback: (input: IssuesInput) => input.feedback,
      sentiment_analysis: (input: IssuesInput) =>
        JSON.stringify(input.sentiment_analysis),
      format_instructions: () => formatInstructions,
    },
    issuesPrompt,
    llm,
    outputParser,
  ])
}
