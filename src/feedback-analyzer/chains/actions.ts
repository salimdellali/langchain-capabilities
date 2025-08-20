import { z } from "zod"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "langchain/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import type { Sentiment } from "./sentiment.js"
import type { Issues } from "./issues.js"

// Prompt
const actionsPrompt = PromptTemplate.fromTemplate(`
You are a senior customer success manager creating an action plan. 
Based on the analysis, develop a comprehensive, executable plan.

Consider:
- Immediate customer retention needs
- Long-term relationship repair
- Operational improvements
- Prevention strategies
- Resource allocation and ROI

Original Feedback: {feedback}
Sentiment Analysis: {sentiment_analysis}
Identified Issues: {issues_analysis}

Create actionable recommendations with clear ownership and timelines.

{format_instructions}
`)

// Schema
export const ActionsSchema = z.object({
  priority: z
    .enum(["low", "medium", "high", "critical"])
    .describe("Overall priority for this feedback"),
  actions: z
    .array(
      z.object({
        task: z.string().describe("Specific action to take"),
        owner: z.string().describe("Department responsible"),
        timeline: z
          .enum(["immediate", "24h", "1week", "1month"])
          .describe("Completion timeline"),
      })
    )
    .describe("List of recommended actions"),
  followUpRequired: z
    .boolean()
    .describe("Whether direct customer follow-up is needed"),
})

export type Actions = z.infer<typeof ActionsSchema>

type ActionsInput = {
  feedback: string
  sentiment_analysis: Sentiment
  issues_analysis: Issues
}

// Runnable
export const createActionRunnable = (llm: ChatGoogleGenerativeAI) => {
  const outputParser = StructuredOutputParser.fromZodSchema(ActionsSchema)
  const formatInstructions = outputParser.getFormatInstructions()

  return RunnableSequence.from([
    {
      feedback: (input: ActionsInput) => input.feedback,
      sentiment_analysis: (input: ActionsInput) =>
        JSON.stringify(input.sentiment_analysis),
      issues_analysis: (input: ActionsInput) =>
        JSON.stringify(input.issues_analysis),
      format_instructions: () => formatInstructions,
    },
    actionsPrompt,
    llm,
    outputParser,
  ])
}
