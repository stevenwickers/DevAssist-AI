import { useState } from 'react'
import { CheckCircle2, Clipboard, ClipboardCheck, FileText, ListChecks } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import type { SummarizeResponse } from '../types.ts'

type Props = {
  result: SummarizeResponse | null;
  isLoading?: boolean;
  error?: string | null;
};

type CopyState = 'idle' | 'copied';

function ResultCard({
                      title,
                      icon,
                      children,
                      onCopy,
                    }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onCopy?: () => void;
}) {
  return (
    <article className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">{icon}</div>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>

        {onCopy ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCopy}>
            <Clipboard className="mr-2 size-4" />
            Copy
          </Button>
        ) : null}
      </div>

      {children}
    </article>
  )
}

function LoadingCards() {
  return (
    <div className="grid gap-4" aria-live="polite" aria-busy="true">
      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <p className="text-sm font-medium">Generating summary...</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The AI response is on its way.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-[92%]" />
        <Skeleton className="h-4 w-[78%]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
          <Skeleton className="mb-4 h-5 w-44" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-[88%]" />
          <Skeleton className="h-4 w-[76%]" />
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-[84%]" />
          <Skeleton className="h-4 w-[71%]" />
        </div>
      </div>
    </div>
  )
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export function SummarizerResults({
                                    result,
                                    isLoading = false,
                                    error = null,
                                  }: Props) {
  const [summaryCopyState, setSummaryCopyState] = useState<CopyState>('idle')
  const [takeawaysCopyState, setTakeawaysCopyState] = useState<CopyState>('idle')
  const [actionsCopyState, setActionsCopyState] = useState<CopyState>('idle')

  const showCopiedState = (setter: (value: CopyState) => void) => {
    setter('copied')
    window.setTimeout(() => setter('idle'), 1500)
  }

  const handleCopySummary = async () => {
    if (!result?.summary) return
    await copyToClipboard(result.summary)
    showCopiedState(setSummaryCopyState)
  }

  const handleCopyTakeaways = async () => {
    if (!result?.keyTakeaways?.length) return
    await copyToClipboard(result.keyTakeaways.map((item) => `• ${item}`).join('\n'))
    showCopiedState(setTakeawaysCopyState)
  }

  const handleCopyActions = async () => {
    if (!result?.actionItems?.length) return
    await copyToClipboard(result.actionItems.map((item) => `• ${item}`).join('\n'))
    showCopiedState(setActionsCopyState)
  }

  if (isLoading) {
    return <LoadingCards />
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive shadow-sm">
        <p className="font-medium">Something went wrong.</p>
        <p className="mt-1">{error}</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed bg-card/60 p-6 text-center shadow-sm">
        <div className="max-w-md space-y-2">
          <h3 className="text-base font-semibold">Your summary will appear here</h3>
          <p className="text-sm text-muted-foreground">
            Submit text on the left to generate a summary, key takeaways, and
            actionable next steps.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <ResultCard
        title={summaryCopyState === 'copied' ? 'Summary copied' : 'Summary'}
        icon={
          summaryCopyState === 'copied' ? (
            <ClipboardCheck className="size-5" />
          ) : (
            <FileText className="size-5" />
          )
        }
        onCopy={handleCopySummary}
      >
        <p className="text-sm leading-7 text-foreground">{result.summary}</p>
      </ResultCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ResultCard
          title={takeawaysCopyState === 'copied' ? 'Takeaways copied' : 'Key Takeaways'}
          icon={
            takeawaysCopyState === 'copied' ? (
              <ClipboardCheck className="size-5" />
            ) : (
              <ListChecks className="size-5" />
            )
          }
          onCopy={handleCopyTakeaways}
        >
          <ul className="space-y-3 text-sm">
            {result.keyTakeaways.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3">
                <span className="mt-1 text-muted-foreground">•</span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard
          title={actionsCopyState === 'copied' ? 'Action items copied' : 'Action Items'}
          icon={
            actionsCopyState === 'copied' ? (
              <ClipboardCheck className="size-5" />
            ) : (
              <CheckCircle2 className="size-5" />
            )
          }
          onCopy={handleCopyActions}
        >
          <ul className="space-y-3 text-sm">
            {result.actionItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3">
                <span className="mt-1 text-muted-foreground">☐</span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      </div>
    </div>
  )
}
