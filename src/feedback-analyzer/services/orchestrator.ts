import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables"
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createSentimentRunnable } from "../chains/sentiment.js"
import { createIssuesRunnable } from "../chains/issues.js"
import { createActionRunnable } from "../chains/actions.js"
import type { AnalysisResult } from "./fileService.js"

export const createPipeline = (llm: ChatGoogleGenerativeAI) => {
  const sentimentRunnable = createSentimentRunnable(llm)
  const issuesRunnable = createIssuesRunnable(llm)
  const actionRunnable = createActionRunnable(llm)

  return RunnableSequence.from([
    // Stage 1: Sentiment Analysis Chain
    RunnablePassthrough.assign({
      sentiment_analysis: sentimentRunnable,
    }),
    // Stage 2: Issues Identification Chain
    RunnablePassthrough.assign({
      issues_analysis: issuesRunnable,
    }),
    // Stage 3: Action Plan Generation Chain
    RunnablePassthrough.assign({
      action_plan: actionRunnable,
    }),
  ])
}

export const executePipeline = async (
  feedback: string,
  llm: ChatGoogleGenerativeAI
): Promise<AnalysisResult> => {
  const startTime = Date.now()
  const pipeline = createPipeline(llm)

  const result = await pipeline.invoke({ feedback })
  const processingTime = Date.now() - startTime

  return {
    metadata: {
      analysis_id: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
    },
    input: {
      feedback: feedback,
      word_count: feedback.split(" ").length,
    },
    results: {
      sentiment: result.sentiment_analysis,
      issues: result.issues_analysis,
      actions: result.action_plan,
    },
  }
}
