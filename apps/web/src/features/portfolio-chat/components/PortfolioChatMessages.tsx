import { Bot, Loader2, User2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'

import type { ChatMessage } from '../types.ts'

type Props = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

function EmptyState() {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed bg-card/60 p-6 text-center shadow-sm">
      <div className="max-w-md space-y-2">
        <h3 className="text-base font-semibold">Start the conversation</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions about projects, frontend work, backend APIs, architecture,
          or technologies used across your portfolio.
        </p>
      </div>
    </div>
  )
}

function LoadingMessage() {
  return (
    <div
      className="rounded-2xl border bg-card p-4 shadow-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mb-3 flex items-center gap-2">
        <Bot className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Portfolio Assistant</span>
      </div>
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Generating a grounded answer...
      </div>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-[92%]" />
      <Skeleton className="h-4 w-[74%]" />
    </div>
  )
}

export function PortfolioChatMessages({
                                        messages,
                                        isLoading = false,
                                      }: Props) {
  if (!messages.length && !isLoading) {
    return <EmptyState />
  }

  return (
    <section className="grid gap-4">
      {messages.map((message) => {
        const isUser = message.role === 'user'

        return (
          <article
            key={message.id}
            className={`rounded-2xl border p-4 shadow-sm ${
              isUser ? 'bg-muted/40' : 'bg-card'
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              {isUser ? (
                <>
                  <User2 className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">You</span>
                </>
              ) : (
                <>
                  <Bot className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Portfolio Assistant</span>
                </>
              )}
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {message.content}
            </p>

            {!isUser && message.sources?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {message.sources.map((source) => (
                  <Badge key={source.id} variant="secondary">
                    {source.label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </article>
        )
      })}

      {isLoading ? <LoadingMessage /> : null}
    </section>
  )
}
