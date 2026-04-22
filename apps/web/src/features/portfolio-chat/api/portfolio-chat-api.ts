import { askAi } from '@/features/ai/ask-api.ts'
import type {
  PortfolioChatRequest,
  PortfolioChatResponse,
} from '../types.ts'

function buildPortfolioChatPrompt({ message, history }: PortfolioChatRequest) {
  const recentHistory = history
    .slice(-6)
    .map((item) => `${item.role}: ${item.content}`)
    .join('\n')

  return [
    'You are a portfolio assistant for Steven Wickers.',
    'Answer questions about projects, AI work, frontend development, backend API experience, architecture, and technical strengths.',
    'If you do not have enough portfolio context, say what information would be needed instead of inventing details.',
    recentHistory ? `Recent conversation:\n${recentHistory}` : '',
    `User question:\n${message}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export async function sendPortfolioChat(
  request: PortfolioChatRequest
): Promise<PortfolioChatResponse> {
  const reply = await askAi(buildPortfolioChatPrompt(request))

  return {
    reply,
    sources: [{ id: 'openai-api', label: 'OpenAI API' }],
  }
}
