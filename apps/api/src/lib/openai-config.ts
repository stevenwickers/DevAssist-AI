import OpenAI from 'openai'

let openAiClient: OpenAI | null = null
let openAiClientKey: string | null = null

export function isOpenAiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

export const missingOpenAiKeyMessage =
  'OPENAI_API_KEY is not set. This app can only run in MOCK mode until the OPENAI_API_KEY is set.'

export function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error(missingOpenAiKeyMessage)
  }

  if (!openAiClient || openAiClientKey !== apiKey) {
    openAiClient = new OpenAI({ apiKey })
    openAiClientKey = apiKey
  }

  return openAiClient
}
