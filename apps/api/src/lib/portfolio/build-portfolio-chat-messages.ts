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
  const recentHistory = history.slice(-6)
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
        'You are a portfolio assistant for Steven Wickers. Answer using only the retrieved portfolio context and the recent conversation. If the context does not support a claim, say that the available portfolio documents do not provide enough evidence. Keep the answer concise, professional, and specific. When helpful, mention the source titles naturally in the answer.',
    },
    ...(recentHistory.length
      ? [
          {
            role: 'system' as const,
            content: `Recent conversation:\n${recentHistory
              .map((entry) => `${entry.role}: ${entry.content}`)
              .join('\n')}`,
          },
        ]
      : []),
    {
      role: 'system' as const,
      content: `Retrieved portfolio context:\n${contextBlock}`,
    },
    {
      role: 'user' as const,
      content: message,
    },
  ]
}
