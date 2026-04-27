import OpenAI from 'openai'
import { getElapsedMs, logAiDemoEvent } from '../ai-demo-logger.js'

const embeddingModel =
  process.env.PORTFOLIO_EMBEDDING_MODEL ?? 'text-embedding-3-small'

function getOpenAiClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAiClient()
  const startedAt = performance.now()

  logAiDemoEvent('Calling OpenAI embeddings API', {
    model: embeddingModel,
    inputCount: 1,
    inputCharacters: text.length,
  })

  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: text,
  })

  logAiDemoEvent('OpenAI embeddings response received', {
    model: embeddingModel,
    durationMs: getElapsedMs(startedAt),
    vectorDimensions: response.data[0].embedding.length,
  })

  return response.data[0].embedding
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) {
    return []
  }

  const openai = getOpenAiClient()
  const startedAt = performance.now()

  logAiDemoEvent('Calling OpenAI embeddings API', {
    model: embeddingModel,
    inputCount: texts.length,
    inputCharacters: texts.reduce((total, text) => total + text.length, 0),
  })

  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: texts,
  })

  logAiDemoEvent('OpenAI embeddings response received', {
    model: embeddingModel,
    durationMs: getElapsedMs(startedAt),
    vectors: response.data.length,
    vectorDimensions: response.data[0]?.embedding.length,
  })

  return response.data.map((item) => item.embedding)
}
