import fs from "fs/promises"
import path from "path"
import type { FeedbackAnalysisResult } from "./orchestrator"

export const readFeedback = async (filename: string): Promise<string> => {
  const inputPath = path.join(process.cwd(), "input", filename)
  const content = await fs.readFile(inputPath, "utf8")
  return content.trim()
}

export const saveAnalysis = async (
  data: FeedbackAnalysisResult
): Promise<string> => {
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), "output")
  await fs.mkdir(outputDir, { recursive: true })

  // Generate output filename if not provided
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `feedback-analysis-${timestamp}.json`

  const outputPath = path.join(outputDir, filename)
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf8")

  return outputPath
}
