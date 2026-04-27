import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { useDataSource } from '@/features/data-source/useDataSource.ts'
import { PortfolioChatForm } from '../components/PortfolioChatForm.tsx'
import { PortfolioChatMessages } from '../components/PortfolioChatMessages.tsx'
import { sendPortfolioChat } from '../api/portfolio-chat-api.ts'
import { sendPortfolioChatMock } from '../mock.ts'
import { PageHeader } from '@/components/PageHeader.tsx'
import type { ChatMessage } from '../types.ts'

function createMessage(
  role: ChatMessage['role'],
  content: string,
  sources?: ChatMessage['sources']
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    sources,
  }
}

export function PortfolioChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'assistant',
      'Hi — ask me about Steven’s projects, AI work, frontend development, backend API experience, or technical strengths.'
    ),
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { useApi } = useDataSource()

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const nextUserMessage = createMessage('user', trimmed)

    debugger
    setMessages((prev) => [...prev, nextUserMessage])
    setInput('')
    setIsLoading(true)

    try {
      const sendMessage = useApi ? sendPortfolioChat : sendPortfolioChatMock
      const response = await sendMessage({
        message: trimmed,
        history: messages,
      })

      const assistantMessage = createMessage(
        'assistant',
        response.reply,
        response.sources
      )

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage = createMessage(
        'assistant',
        'Something went wrong while generating a response. Please try again.'
      )

      debugger
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setInput('')
    setIsLoading(false)
    setMessages([
      createMessage(
        'assistant',
        'Hi — ask me about Steven’s projects, AI work, frontend development, backend API experience, or technical strengths.'
      ),
    ])
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader isApiMode={useApi}>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Chat</h1>
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
              Ask questions about experience, projects, architecture, and technical strengths using a portfolio-grounded assistant.
            </p>
          </div>
      </PageHeader>
      <div className="grid gap-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Reset Chat
          </Button>
        </div>

        <PortfolioChatForm
          value={input}
          isLoading={isLoading}
          onChange={setInput}
          onSend={handleSend}
        />

        <PortfolioChatMessages messages={messages} isLoading={isLoading} />
      </div>
    </div>
  )
}
