import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { appNavItems } from '@/components/layouts/app-nav-items.ts'

export function HomePage() {
  const featureItems = appNavItems.filter((item: any) => item.to !== '/')

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Portfolio project
        </Badge>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            DevAssist AI
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            A lightweight AI proof of concept built with Vite, React, TanStack
            Router, shadcn/ui, and Tailwind CSS to demonstrate practical
            developer-focused AI workflows.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureItems.map((item) => {
          const Icon = item.icon

          return (
            <article
              key={item.to}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-muted">
                <Icon className="size-5" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="mt-5">
                <Button asChild variant="outline">
                  <Link to={item.to}>
                    Open
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
