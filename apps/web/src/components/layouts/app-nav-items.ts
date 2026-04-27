import type { LucideIcon } from 'lucide-react'
import {
  Braces,
  FileText,
  LayoutDashboard,
  MessageSquareText,
} from 'lucide-react'
import { CODE_EXPLAINER_ROUTE } from '@/routes/code-explainer'
import { SUMMARIZE_ROUTE } from '@/routes/summarizer'
import { PORTFOLIO_CHAT_ROUTE } from '@/routes/portfolio-chat'

export type AppNavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  description?: string;
};

export const appNavItems: AppNavItem[] = [
  {
    title: 'Home',
    to: '/',
    icon: LayoutDashboard,
    description: 'Project overview',
  },
  {
    title: 'Portfolio Chat',
    to: PORTFOLIO_CHAT_ROUTE,
    icon: MessageSquareText,
    description: 'Grounded portfolio assistant',
  },
  {
    title: 'Code Explainer',
    to: CODE_EXPLAINER_ROUTE,
    icon: Braces,
    description: 'Plain-English code explanations',
  },
  {
    title: 'Summarizer',
    to: SUMMARIZE_ROUTE,
    icon: FileText,
    description: 'Summaries and action items',
  },
]
