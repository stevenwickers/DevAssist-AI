import type {
  PortfolioChatRequest,
  PortfolioChatResponse,
} from '../types.ts'
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export async function sendPortfolioChat(
  request: PortfolioChatRequest
): Promise<PortfolioChatResponse> {
  const response = await fetch(`${apiUrl}/ai/portfolio-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: request.message,
      history: request.history.map((item) => ({
        role: item.role,
        content: item.content,
      })),
    }),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: string }
      | null

    throw new Error(errorBody?.error ?? 'Failed to call the portfolio chat API.')
  }

  const data = (await response.json()) as PortfolioChatResponse

  debugger
  return {
    reply: data.reply,
    sources: data.sources,
  }
}
