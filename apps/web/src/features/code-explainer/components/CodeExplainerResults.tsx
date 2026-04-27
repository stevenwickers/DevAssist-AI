import { useState, type ReactNode } from 'react'
import {
  BookOpenText,
  Clipboard,
  ClipboardCheck,
  Lightbulb,
  ListOrdered,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import type { CodeExplainResponse } from '../types.ts'

type Props = {
  result: CodeExplainResponse | null;
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
  icon: ReactNode;
  children: ReactNode;
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
        <p className="text-sm font-medium">Generating explanation...</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The AI response is on its way.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-[92%]" />
        <Skeleton className="h-4 w-[76%]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
          <Skeleton className="mb-4 h-5 w-44" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-[88%]" />
          <Skeleton className="h-4 w-[73%]" />
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-[84%]" />
          <Skeleton className="h-4 w-[71%]" />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-[89%]" />
        <Skeleton className="h-4 w-[68%]" />
      </div>
    </div>
  )
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export function CodeExplainerResults({
   result,
   isLoading = false,
   error = null,
 }: Props) {
  const [overviewCopyState, setOverviewCopyState] = useState<CopyState>('idle')
  const [stepsCopyState, setStepsCopyState] = useState<CopyState>('idle')
  const [conceptsCopyState, setConceptsCopyState] = useState<CopyState>('idle')
  const [improvementsCopyState, setImprovementsCopyState] = useState<CopyState>('idle')

  const showCopiedState = (setter: (value: CopyState) => void) => {
    setter('copied')
    window.setTimeout(() => setter('idle'), 1500)
  }

  const copyList = async (
    values: string[],
    setter: (value: CopyState) => void
  ) => {
    await copyToClipboard(values.map((item) => `• ${item}`).join('\n'))
    showCopiedState(setter)
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
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed bg-card/60 p-6 text-center shadow-sm">
        <div className="max-w-md space-y-2">
          <h3 className="text-base font-semibold">Your code explanation will appear here</h3>
          <p className="text-sm text-muted-foreground">
            Submit a code snippet to generate an overview, step-by-step explanation,
            important concepts, and possible improvements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <ResultCard
        title={overviewCopyState === 'copied' ? 'Overview copied' : 'Overview'}
        icon={
          overviewCopyState === 'copied' ? (
            <ClipboardCheck className="size-5" />
          ) : (
            <BookOpenText className="size-5" />
          )
        }
        onCopy={async () => {
          await copyToClipboard(result.overview)
          showCopiedState(setOverviewCopyState)
        }}
      >
        <p className="text-sm leading-7 text-foreground">{result.overview}</p>
      </ResultCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ResultCard
          title={stepsCopyState === 'copied' ? 'Steps copied' : 'Step-by-Step'}
          icon={
            stepsCopyState === 'copied' ? (
              <ClipboardCheck className="size-5" />
            ) : (
              <ListOrdered className="size-5" />
            )
          }
          onCopy={() => copyList(result.stepByStep, setStepsCopyState)}
        >
          <ol className="space-y-3 text-sm">
            {result.stepByStep.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3">
                <span className="mt-0.5 text-muted-foreground">{index + 1}.</span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ol>
        </ResultCard>

        <ResultCard
          title={conceptsCopyState === 'copied' ? 'Concepts copied' : 'Important Concepts'}
          icon={
            conceptsCopyState === 'copied' ? (
              <ClipboardCheck className="size-5" />
            ) : (
              <Lightbulb className="size-5" />
            )
          }
          onCopy={() => copyList(result.importantConcepts, setConceptsCopyState)}
        >
          <ul className="space-y-3 text-sm">
            {result.importantConcepts.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3">
                <span className="mt-1 text-muted-foreground">•</span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      </div>

      <ResultCard
        title={
          improvementsCopyState === 'copied'
            ? 'Improvements copied'
            : 'Possible Improvements'
        }
        icon={
          improvementsCopyState === 'copied' ? (
            <ClipboardCheck className="size-5" />
          ) : (
            <Wrench className="size-5" />
          )
        }
        onCopy={() => copyList(result.possibleImprovements, setImprovementsCopyState)}
      >
        <ul className="space-y-3 text-sm">
          {result.possibleImprovements.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3">
              <span className="mt-1 text-muted-foreground">•</span>
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      </ResultCard>
    </div>
  )
}
