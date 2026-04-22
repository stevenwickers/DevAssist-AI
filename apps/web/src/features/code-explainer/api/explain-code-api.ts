import { askAi, parseJsonReply } from '@/features/ai/ask-api.ts'
import type {
  CodeExplainRequest,
  CodeExplainResponse,
} from '../types.ts'

function buildCodeExplainerPrompt({ code, language }: CodeExplainRequest) {
  return [
    `Explain the following ${language} code in clear developer-friendly language.`,
    'Return only valid JSON with this exact shape:',
    '{"overview":"string","stepByStep":["string"],"importantConcepts":["string"],"possibleImprovements":["string"]}',
    'Code:',
    code,
  ].join('\n\n')
}

function parseCodeExplanationReply(reply: string): CodeExplainResponse {
  const parsed = parseJsonReply<Partial<CodeExplainResponse>>(reply, {})

  return {
    overview: parsed.overview ?? reply,
    stepByStep: Array.isArray(parsed.stepByStep) ? parsed.stepByStep : [],
    importantConcepts: Array.isArray(parsed.importantConcepts)
      ? parsed.importantConcepts
      : [],
    possibleImprovements: Array.isArray(parsed.possibleImprovements)
      ? parsed.possibleImprovements
      : [],
  }
}

export async function explainCode(
  request: CodeExplainRequest
): Promise<CodeExplainResponse> {
  const reply = await askAi(buildCodeExplainerPrompt(request))

  return parseCodeExplanationReply(reply)
}
