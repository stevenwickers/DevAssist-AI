import { useMemo } from 'react'
import { Loader2, Sparkles, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

import type { SummaryTone } from '../types.ts'

type Props = {
  text: string;
  tone: SummaryTone;
  isLoading?: boolean;
  onTextChange: (value: string) => void;
  onToneChange: (value: SummaryTone) => void;
  onSubmit: () => void;
  onClear: () => void;
};

const MAX_CHARACTERS = 8000

export function SummarizerForm({
                                 text,
                                 tone,
                                 isLoading = false,
                                 onTextChange,
                                 onToneChange,
                                 onSubmit,
                                 onClear,
                               }: Props) {
  const characterCount = text.length
  const isOverLimit = characterCount > MAX_CHARACTERS
  const isSubmitDisabled = !text.trim() || isLoading || isOverLimit

  const helperText = useMemo(() => {
    if (isOverLimit) {
      return `Text exceeds ${MAX_CHARACTERS.toLocaleString()} characters.`
    }

    return `${characterCount.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters`
  }, [characterCount, isOverLimit])

  return (
    <section
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
      aria-busy={isLoading}
    >
      <div className="mb-5 flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Paste your text</h2>
        <p className="text-sm text-muted-foreground">
          Add meeting notes, transcript text, article content, or any long-form
          text you want summarized.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="summarizer-text">Text input</Label>
          <Textarea
            id="summarizer-text"
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Paste meeting notes, article text, or transcripts here..."
            className="min-h-[240px] resize-y"
            disabled={isLoading}
          />
          <p
            className={`text-xs ${
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {helperText}
          </p>
        </div>

        <div className="grid gap-2 sm:max-w-[220px]">
          <Label htmlFor="summarizer-tone">Tone</Label>
          <Select
            value={tone}
            onValueChange={(value) => onToneChange(value as SummaryTone)}
            disabled={isLoading}
          >
            <SelectTrigger id="summarizer-tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onSubmit} disabled={isSubmitDisabled} className="sm:min-w-36">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                Summarize
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={isLoading || !text.length}
          >
            <Trash2 className="mr-2 size-4" />
            Clear
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground" role="status">
            Summarizing your text. This can take a few seconds in API mode.
          </p>
        ) : null}
      </div>
    </section>
  )
}
