import { loadPortfolioIndex } from './index-store.js'
import { embedText } from './embeddings.js'
import type {
  IndexedPortfolioChunk,
  RetrievedPortfolioChunk,
} from './types.js'

function cosineSimilarity(left: number[], right: number[]) {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index]
    leftNorm += left[index] * left[index]
    rightNorm += right[index] * right[index]
  }

  if (!leftNorm || !rightNorm) {
    return 0
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
}

function rankChunks(
  chunks: IndexedPortfolioChunk[],
  questionEmbedding: number[],
  limit: number
): RetrievedPortfolioChunk[] {
  return chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
}

export async function retrievePortfolioChunks(
  question: string,
  limit = 4
): Promise<RetrievedPortfolioChunk[]> {
  const [chunks, questionEmbedding] = await Promise.all([
    loadPortfolioIndex(),
    embedText(question),
  ])

  return rankChunks(chunks, questionEmbedding, limit)
}
