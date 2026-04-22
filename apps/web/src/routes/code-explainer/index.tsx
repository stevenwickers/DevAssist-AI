import { createFileRoute } from '@tanstack/react-router'
import { CodeExplainerPage } from '@/features/code-explainer/pages/CodeExplainerPage.tsx'

export const CODE_EXPLAINER_ROUTE = '/code-explainer/'

export const Route = createFileRoute('/code-explainer/')({
  component: CodeExplainerPage,
})
