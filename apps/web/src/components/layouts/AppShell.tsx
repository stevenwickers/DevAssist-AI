import type { ReactNode } from 'react'
import { Bot } from 'lucide-react'
import { AppSidebarNav } from './AppSidebarNav.tsx'
import { MobileTopNav } from './MobileTopNav.tsx'
import { ThemeToggle } from '@/components/ThemeToggle.tsx'
import { DataSourceToggle } from '@/features/data-source/DataSourceToggle.tsx'

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <MobileTopNav />

      <div className="mx-auto grid min-h-dvh max-w-7xl md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r bg-background/95 md:block">
          <div className="sticky top-0 flex h-dvh flex-col px-4 py-6">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <Bot className="size-5" />
              </div>

              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  DevAssist AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI developer toolkit
                </p>
              </div>
            </div>

            <AppSidebarNav />

            <div className="mt-auto grid gap-3">
              <DataSourceToggle />

              <div className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-2 shadow-sm">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    Light or dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-medium">
                  Portfolio Proof of Concept
                </h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  A React showcase for summarization, code explanation, and
                  portfolio-grounded AI chat.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
