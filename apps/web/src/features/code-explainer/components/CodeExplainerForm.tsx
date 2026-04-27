import { useMemo } from 'react'
import { Braces, Loader2, Sparkles, Trash2 } from 'lucide-react'

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

import type { SupportedLanguage } from '../types.ts'
import { Badge } from '@/components/ui'

type Props = {
  code: string;
  language: SupportedLanguage;
  isLoading?: boolean;
  onCodeChange: (value: string) => void;
  onLanguageChange: (value: SupportedLanguage) => void;
  onSubmit: () => void;
  onClear: () => void;
};

const MAX_CHARACTERS = 500

export function CodeExplainerForm({
  code,
  language,
  isLoading = false,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  onClear,
}: Props) {
  const characterCount = code.length
  const isOverLimit = characterCount > MAX_CHARACTERS
  const isSubmitDisabled = !code.trim() || isLoading || isOverLimit

  const helperText = useMemo(() => {
    if (isOverLimit) {
      return `Code exceeds ${MAX_CHARACTERS.toLocaleString()} characters.`
    }

    return `${characterCount.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters`
  }, [characterCount, isOverLimit])

  return (
    <section
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
      aria-busy={isLoading}
    >
      <div className="mb-5 flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Paste your code
        </h2>
        <p className="text-sm text-muted-foreground">
          Add a code snippet and choose a language to generate a plain-English explanation.
          Limit to 500 characters.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="code-explainer-text">Code input</Label>
          <Textarea
            id="code-explainer-text"
            maxLength={MAX_CHARACTERS}
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder={'function add(a, b) {\n  return a + b;\n}'}
            className="min-h-[280px] resize-y font-mono text-sm"
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

        <div className="grid gap-2 sm:max-w-[240px]">
          <Label htmlFor="code-language">Language</Label>
          <Select
            value={language}
            onValueChange={(value) => onLanguageChange(value as SupportedLanguage)}
            disabled={isLoading}
          >
            <SelectTrigger id="code-language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="tsx">TSX / React</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onSubmit} disabled={isSubmitDisabled} className="sm:min-w-36">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Explaining...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                Explain Code
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={isLoading || !code.length}
          >
            <Trash2 className="mr-2 size-4" />
            Clear
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              onCodeChange(`export function formatCurrency(value: number) {
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value);
              }`)
            }
            disabled={isLoading}
          >
            <Braces className="mr-2 size-4" />
            Load Example
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground" role="status">
            Explaining the code. This can take a few seconds in API mode.
          </p>
        ) : null}
      </div>
    </section>
  )
}
