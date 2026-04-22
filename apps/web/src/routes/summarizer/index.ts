import { createFileRoute } from '@tanstack/react-router'
import { SummarizerPage } from '@/features/summarizer/pages/SummarizerPage.tsx'

export const SUMMARIZE_ROUTE = '/summarizer/'

export const Route = createFileRoute('/summarizer/')({
  component: SummarizerPage,
})
