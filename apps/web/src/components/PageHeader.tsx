import { type ReactNode } from 'react'
import { Badge } from '@/components/ui'
import { Bot } from 'lucide-react'

type PageHeaderProps = {
  isApiMode: boolean,
  children: ReactNode
}

export function PageHeader({
  isApiMode,
  children
}: PageHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex gap-2">
        <Badge variant="secondary" className="w-fit">
          <Bot className="mr-2 size-4" />
          AI-powered
        </Badge>

        {isApiMode
          ? <Badge>
            API Mode
          </Badge>
          : <Badge variant='secondary'>
            Mock Mode
          </Badge>
        }
      </div>
      {children}
    </header>
  )
}
