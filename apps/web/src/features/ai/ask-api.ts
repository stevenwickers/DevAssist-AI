type AskResponse = {
  reply?: string;
};

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export async function askAi(prompt: string): Promise<string> {
  const response = await fetch(`${apiUrl}/ai/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error('Failed to call the AI API.')
  }

  const data = (await response.json()) as AskResponse

  if (!data.reply) {
    throw new Error('The API did not return a reply.')
  }

  return data.reply
}

export function parseJsonReply<T>(reply: string, fallback: T): T {
  try {
    return JSON.parse(stripJsonCodeFence(reply)) as T
  } catch {
    return fallback
  }
}

function stripJsonCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
}
