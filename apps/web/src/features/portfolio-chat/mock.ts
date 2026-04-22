import type {
  PortfolioChatRequest,
  PortfolioChatResponse,
} from './types.ts'

export async function sendPortfolioChatMock(
  request: PortfolioChatRequest
): Promise<PortfolioChatResponse> {
  const { message } = request

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    reply: `Based on the portfolio context, this answer would describe relevant experience, projects, and technical strengths tied to the question: "${message}". In a full RAG version, this response would be grounded in resume content, project summaries, and selected source chunks.`,
    sources: [
      { id: 'resume', label: 'Resume' },
      { id: 'dotnetmovieapi', label: 'DotNetMovieApi Project' },
      { id: 'react-dashboard', label: 'React Dashboard Notes' },
    ],
  }
}
