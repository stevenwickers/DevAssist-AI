import { askAi, parseJsonReply } from '@/features/ai/ask-api.ts'
import type { SummarizeRequest, SummarizeResponse } from '../types.ts'

function buildSummarizerPrompt({ text, tone }: SummarizeRequest) {
  return [
    `Summarize the following text in a ${tone} tone.`,
    'Return only valid JSON with this exact shape:',
    '{"summary":"string","keyTakeaways":["string"],"actionItems":["string"]}',
    'Text:',
    text,
  ].join('\n\n')
}

function parseSummarizeReply(reply: string): SummarizeResponse {
  const parsed = parseJsonReply<Partial<SummarizeResponse>>(reply, {})

  return {
    summary: parsed.summary ?? reply,
    keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
    actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
  }
}

export async function summarizeText(
  request: SummarizeRequest
): Promise<SummarizeResponse> {
  const reply = await askAi(buildSummarizerPrompt(request))

  return parseSummarizeReply(reply)
}
