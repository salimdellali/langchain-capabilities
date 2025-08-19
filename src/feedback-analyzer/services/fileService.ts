import fs from "fs/promises"
import path from "path"

export interface AnalysisResult {
  metadata: {
    analysis_id: string
    timestamp: string
    processing_time_ms: number
  }
  input: {
    feedback: string
    word_count: number
  }
  results: {
    sentiment: any
    issues: any
    actions: any
  }
}

export const readFeedback = async (filename: string): Promise<string> => {
  const inputPath = path.join(process.cwd(), "input", filename)
  const content = await fs.readFile(inputPath, "utf8")
  return content.trim()
}

export const saveAnalysis = async (
  data: AnalysisResult,
  filename?: string
): Promise<string> => {
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), "output")
  await fs.mkdir(outputDir, { recursive: true })

  // Generate filename if not provided
  if (!filename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    filename = `feedback-analysis-${timestamp}.json`
  }

  const outputPath = path.join(outputDir, filename)
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf8")

  return outputPath
}
