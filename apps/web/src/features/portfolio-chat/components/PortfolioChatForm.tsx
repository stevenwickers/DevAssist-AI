import { Loader2, SendHorizonal } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'

type Props = {
  value: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function PortfolioChatForm({
                                    value,
                                    isLoading = false,
                                    onChange,
                                    onSend,
                                  }: Props) {
  const isDisabled = !value.trim() || isLoading

  return (
    <section
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5"
      aria-busy={isLoading}
    >
      <div className="mb-3 space-y-1">
        <h2 className="text-base font-semibold">Ask about my experience</h2>
        <p className="text-sm text-muted-foreground">
          Ask about projects, backend work, frontend skills, tools, or architecture decisions.
        </p>
      </div>

      <div className="grid gap-3">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Example: What kinds of backend APIs has Steven built?"
          className="min-h-[120px] resize-y"
          disabled={isLoading}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={onSend} disabled={isDisabled} className="sm:min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 size-4" />
                Send
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            {isLoading
              ? 'Generating a grounded answer. This can take a few seconds in API mode.'
              : 'This proof of concept returns grounded answers based on portfolio-related context.'}
          </p>
        </div>
      </div>
    </section>
  )
}
