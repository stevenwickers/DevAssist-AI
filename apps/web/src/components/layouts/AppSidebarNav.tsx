import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '@/lib/utils.ts'
import { appNavItems } from './app-nav-items.ts'

function isItemActive(pathname: string, to: string) {
  if (to === '/') {
    return pathname === '/'
  }

  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AppSidebarNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <nav className="grid gap-1">
      {appNavItems.map((item) => {
        const Icon = item.icon
        const active = isItemActive(pathname, item.to)

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'group flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors',
              'hover:bg-muted hover:text-foreground',
              active ? 'bg-muted text-foreground' : 'text-muted-foreground'
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <div className="min-w-0">
              <div className="font-medium">{item.title}</div>
              {item.description ? (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
