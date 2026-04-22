import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { router } from './router.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { DataSourceProvider } from '@/features/data-source/DataSourceProvider.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <DataSourceProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </DataSourceProvider>
    </ThemeProvider>
  </React.StrictMode>
)
