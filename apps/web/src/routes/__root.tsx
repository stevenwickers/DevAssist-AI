import { createRootRoute, Outlet } from '@tanstack/react-router'
//import { AppLayout } from 'src/components/layouts'
import { AppShell } from '@/components/layouts/AppShell.tsx'

export const Route = createRootRoute({
  component: function Root() {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    )
  },
})
