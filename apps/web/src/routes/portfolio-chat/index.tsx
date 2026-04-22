import { createFileRoute } from '@tanstack/react-router'
import { PortfolioChatPage } from '@/features/portfolio-chat/pages/PortfolioChatPage.tsx'

export const PORTFOLIO_CHAT_ROUTE = '/portfolio-chat/'

export const Route = createFileRoute('/portfolio-chat/')({
  component: PortfolioChatPage,
})
