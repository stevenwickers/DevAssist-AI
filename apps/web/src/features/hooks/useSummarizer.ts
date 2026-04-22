import { useState } from 'react'

type SummarizeResponse = {
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
};

export function useSummarizer() {
  const [data, setData] = useState<SummarizeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function summarize(text: string) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to summarize text.')
      }

      const result: SummarizeResponse = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, summarize }
}
