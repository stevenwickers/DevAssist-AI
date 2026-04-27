import OpenAI from 'openai'

const embeddingModel =
  process.env.PORTFOLIO_EMBEDDING_MODEL ?? 'text-embedding-3-small'

function getOpenAiClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAiClient()
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: text,
  })

  return response.data[0].embedding
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) {
    return []
  }

  const openai = getOpenAiClient()
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: texts,
  })

  return response.data.map((item) => item.embedding)
}
