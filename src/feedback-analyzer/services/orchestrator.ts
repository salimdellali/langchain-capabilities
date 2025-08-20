import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables"
import type { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createSentimentRunnable, Sentiment } from "../chains/sentiment.js"
import { createIssuesRunnable, Issues } from "../chains/issues.js"
import { createActionRunnable, Actions } from "../chains/actions.js"

export interface FeedbackAnalysisResult {
  metadata: {
    analysisId: string
    timestamp: string
    processingTimeMs: number
  }
  input: {
    feedback: string
    wordCount: number
  }
  results: {
    sentiment: Sentiment
    issues: Issues
    actions: Actions
  }
}

export const createPipeline = (llm: ChatGoogleGenerativeAI) => {
  const sentimentRunnable = createSentimentRunnable(llm)
  const issuesRunnable = createIssuesRunnable(llm)
  const actionRunnable = createActionRunnable(llm)

  return RunnableSequence.from([
    // Stage 1: Sentiment Analysis Chain
    // context has { feedback }
    RunnablePassthrough.assign({
      sentimentAnalysis: sentimentRunnable,
    }),

    // Stage 2: Issues Identification Chain
    // context has { feedback, sentimentAnalysis }
    RunnablePassthrough.assign({
      issuesAnalysis: issuesRunnable,
    }),

    // Stage 3: Action Plan Generation Chain
    // context has { feedback, sentimentAnalysis, issuesAnalysis }
    RunnablePassthrough.assign({
      actionPlan: actionRunnable,
    }),
  ])
}

export const executePipeline = async (
  feedback: string,
  llm: ChatGoogleGenerativeAI
): Promise<FeedbackAnalysisResult> => {
  const startTime = Date.now()
  const pipeline = createPipeline(llm)

  const result = await pipeline.invoke({ feedback })
  const processingTime = Date.now() - startTime

  return {
    metadata: {
      analysisId: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      processingTimeMs: processingTime,
    },
    input: {
      feedback,
      wordCount: feedback.split(" ").length,
    },
    results: {
      sentiment: result.sentimentAnalysis,
      issues: result.issuesAnalysis,
      actions: result.actionPlan,
    },
  }
}
