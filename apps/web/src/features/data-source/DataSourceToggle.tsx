import { Database, FlaskConical } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'
import { useDataSource } from './useDataSource.ts'

type Props = {
  compact?: boolean;
};

export function DataSourceToggle({ compact = false }: Props) {
  const { useApi, setUseApi } = useDataSource()
  const Icon = useApi ? Database : FlaskConical
  const label = useApi ? 'API calls' : 'Mock data'
  const description = useApi ? 'Live backend responses' : 'Local demo responses'
  const nextMode = useApi ? 'mock data' : 'API calls'

  if (compact) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setUseApi(!useApi)}
        aria-label={`Switch to ${nextMode}`}
        title={label}
      >
        <Icon className="size-4" />
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-medium">Data</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setUseApi(!useApi)}
        aria-label={`Switch to ${nextMode}`}
        title={label}
        className={cn(useApi && 'border-primary/50 text-primary')}
      >
        <Icon className="size-4" />
      </Button>
    </div>
  )
}
