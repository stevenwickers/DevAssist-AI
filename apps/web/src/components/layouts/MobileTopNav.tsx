import { Menu } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import { Button } from '@/components/ui/button.tsx'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { cn } from '@/lib/utils.ts'
import { appNavItems } from './app-nav-items.ts'
import { ThemeToggle } from '@/components/ThemeToggle.tsx'
import { DataSourceToggle } from '@/features/data-source/DataSourceToggle.tsx'

function isItemActive(pathname: string, to: string) {
  if (to === '/') {
    return pathname === '/'
  }

  return pathname === to || pathname.startsWith(`${to}/`)
}

function getCurrentPageTitle(pathname: string) {
  const matchedItem =
    [...appNavItems]
      .sort((a, b) => b.to.length - a.to.length)
      .find((item) => isItemActive(pathname, item.to)) ?? appNavItems[0]

  return matchedItem.title
}

export function MobileTopNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const currentPageTitle = getCurrentPageTitle(pathname)

  return (
    <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3 md:hidden">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight">
          DevAssist AI
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {currentPageTitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DataSourceToggle compact />
        <ThemeToggle />

        <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[300px]">
          <SheetHeader className="mb-4">
            <SheetTitle>DevAssist AI</SheetTitle>
          </SheetHeader>

          <nav className="grid gap-2">
            {appNavItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(pathname, item.to)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors',
                    'hover:bg-muted hover:text-foreground',
                    active ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium">{item.title}</div>
                    {item.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </Link>
              )
            })}
          </nav>
        </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
