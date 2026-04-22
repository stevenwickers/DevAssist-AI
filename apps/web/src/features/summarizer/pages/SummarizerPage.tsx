import { useState } from 'react'
import { useDataSource } from '@/features/data-source/useDataSource.ts'
import { summarizeText } from '../api/summarize-api.ts'
import { SummarizerForm } from '../components/SummarizerForm.tsx'
import { SummarizerResults } from '../components/SummarizerResults.tsx'
import { summarizeTextMock } from '../mock.ts'
import { PageHeader } from '@/components/PageHeader.tsx'
import type { SummarizeResponse, SummaryTone } from '../types.ts'

export function SummarizerPage() {
  const [text, setText] = useState('')
  const [tone, setTone] = useState<SummaryTone>('professional')
  const [result, setResult] = useState<SummarizeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { useApi } = useDataSource()

  const handleSubmit = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const summarize = useApi ? summarizeText : summarizeTextMock
      const response = await summarize({ text, tone })

      setResult(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to summarize the provided text.'
      )
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setResult(null)
    setError(null)
    setTone('professional')
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader isApiMode={useApi}>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Smart Summarizer</h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Turn long text into a concise summary, clear key takeaways, and
            actionable next steps.
          </p>
        </div>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SummarizerForm
          text={text}
          tone={tone}
          isLoading={isLoading}
          onTextChange={setText}
          onToneChange={setTone}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <SummarizerResults
          result={result}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
