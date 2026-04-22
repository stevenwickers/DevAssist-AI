import { useState } from 'react'
import { useDataSource } from '@/features/data-source/useDataSource.ts'
import { CodeExplainerForm } from '../components/CodeExplainerForm.tsx'
import { CodeExplainerResults } from '../components/CodeExplainerResults.tsx'
import { explainCode } from '../api/explain-code-api.ts'
import { explainCodeMock } from '../mock.ts'
import { PageHeader } from '@/components/PageHeader.tsx'
import type {
  CodeExplainResponse,
  SupportedLanguage,
} from '../types.ts'

export function CodeExplainerPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<SupportedLanguage>('typescript')
  const [result, setResult] = useState<CodeExplainResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { useApi } = useDataSource()

  const handleSubmit = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const getExplanation = useApi ? explainCode : explainCodeMock
      const response = await getExplanation({ code, language })

      setResult(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to explain the provided code.'
      )
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setCode('')
    setResult(null)
    setError(null)
    setLanguage('typescript')
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader isApiMode={useApi}>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Code Explainer</h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Paste code and get a plain-English explanation, key concepts, and practical suggestions.
          </p>
        </div>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CodeExplainerForm
          code={code}
          language={language}
          isLoading={isLoading}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        <CodeExplainerResults
          result={result}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
