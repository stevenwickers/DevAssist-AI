type HistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

type RetrievedChunk = {
  id: string
  title: string
  path: string
  text: string
}

export function buildPortfolioChatMessages(params: {
  message: string
  history: HistoryMessage[]
  retrievedChunks: RetrievedChunk[]
}) {
  const { message, history, retrievedChunks } = params
  const recentHistory = history.slice(-6).map((entry) => ({
    role: entry.role,
    content: entry.content,
  }))
  const contextBlock = retrievedChunks
    .map(
      (chunk) =>
        `[Source: ${chunk.title} | Chunk ID: ${chunk.id} | Path: ${chunk.path}]\n${chunk.text}`
    )
    .join('\n\n')

  return [
    {
      role: 'system' as const,
      content:
        'You are a portfolio assistant for Steven Wickers. Answer using only the retrieved portfolio context. Use recent conversation only for conversational continuity, not as evidence for portfolio claims. If the retrieved context does not support a claim, say that the available portfolio documents do not provide enough evidence. Keep the answer concise, professional, and specific. When helpful, mention the source titles naturally in the answer.',
    },
    {
      role: 'system' as const,
      content: `Retrieved portfolio context:\n${contextBlock}`,
    },
    ...recentHistory,
    {
      role: 'user' as const,
      content: message,
    },
  ]
}
