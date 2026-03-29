import type { AnalyzeResponse } from '../../shared/types'
import { analyzeWithHeuristics } from './heuristics'
import { analyzeWithOpenAI } from './openai'

export async function analyzeContract(input: { contractText: string; locale: string }): Promise<AnalyzeResponse> {
  const apiKey = typeof process.env.OPENAI_API_KEY === 'string' ? process.env.OPENAI_API_KEY.trim() : ''
  if (apiKey) {
    const llm = await analyzeWithOpenAI({
      apiKey,
      contractText: input.contractText,
      locale: input.locale,
    })
    if (llm) return llm
  }

  return analyzeWithHeuristics(input.contractText)
}

