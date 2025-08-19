import { z } from "zod"
import { RunnableSequence } from "@langchain/core/runnables"
import { StructuredOutputParser } from "langchain/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai"

// Schema
export const SentimentSchema = z.object({
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .describe("Overall sentiment of the feedback"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence score between 0 and 1"),
  reasoning: z
    .string()
    .describe("Brief explanation for the sentiment classification"),
})

export type Sentiment = z.infer<typeof SentimentSchema>

// Prompt
const sentimentPrompt = PromptTemplate.fromTemplate(`
You are an expert customer experience analyst. 
Analyze the sentiment of the following customer feedback with precision and empathy.

Consider:
- Overall sentiment (positive, negative, neutral)
- Emotional undertones and intensity
- Context and specific pain points
- Customer loyalty indicators

Customer Feedback: {feedback}

{format_instructions}
`)

type SentimentInput = { feedback: string }

// Runnable
export const createSentimentRunnable = (llm: ChatGoogleGenerativeAI) => {
  const outputParser = StructuredOutputParser.fromZodSchema(SentimentSchema)
  const formatInstructions = outputParser.getFormatInstructions()

  return RunnableSequence.from([
    {
      feedback: (input: SentimentInput) => input.feedback,
      format_instructions: () => formatInstructions,
    },
    sentimentPrompt,
    llm,
    outputParser,
  ])
}
