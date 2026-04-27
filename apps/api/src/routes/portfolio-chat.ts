import express from 'express'
import { getElapsedMs, logAiDemoEvent } from '../lib/ai-demo-logger.js'
import { createRateLimit } from '../middleware/rate-limit.js'
import { retrievePortfolioChunks } from '../lib/portfolio/retrieve-chunks.js'
import { buildPortfolioChatMessages } from '../lib/portfolio/build-portfolio-chat-messages.js'
import {
  getOpenAiClient,
  isOpenAiConfigured,
  missingOpenAiKeyMessage,
} from '../lib/openai-config.js'

const router = express.Router()

const portfolioRateLimit = createRateLimit({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60_000,
  maxRequests: Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 10,
})

const portfolioChatModel = process.env.PORTFOLIO_CHAT_MODEL ?? 'gpt-4o-mini'

type PortfolioHistoryMessage = {
  role: 'user' | 'assistant'
  content: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PortfolioChatMessage:
 *       type: object
 *       required:
 *         - role
 *         - content
 *       properties:
 *         role:
 *           type: string
 *           enum: [user, assistant]
 *         content:
 *           type: string
 *     PortfolioChatRequest:
 *       type: object
 *       required:
 *         - message
 *         - history
 *       properties:
 *         message:
 *           type: string
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PortfolioChatMessage'
 *     PortfolioChatSource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         label:
 *           type: string
 *     PortfolioChatResponse:
 *       type: object
 *       properties:
 *         reply:
 *           type: string
 *         sources:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PortfolioChatSource'
 */

/**
 * @swagger
 * /ai/portfolio-chat:
 *   post:
 *     summary: Answer portfolio questions using retrieved portfolio documents
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioChatRequest'
 *     responses:
 *       200:
 *         description: Portfolio chat response generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PortfolioChatResponse'
 *       400:
 *         description: Invalid request body.
 *       429:
 *         description: Too many AI requests.
 *       500:
 *         description: Error generating portfolio response.
 */
router.post('/portfolio-chat', portfolioRateLimit, async (req, res) => {
  const { message, history } = req.body as {
    message?: unknown
    history?: unknown
  }

  if (!isOpenAiConfigured()) {
    res.status(503).json({ error: missingOpenAiKeyMessage })
    return
  }

  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'message is required' })
    return
  }

  if (
    !Array.isArray(history) ||
    history.some(
      (item) =>
        !item ||
        typeof item !== 'object' ||
        !('role' in item) ||
        !('content' in item) ||
        (item.role !== 'user' && item.role !== 'assistant') ||
        typeof item.content !== 'string'
    )
  ) {
    res.status(400).json({ error: 'history must be an array of chat messages' })
    return
  }

  try {
    const startedAt = performance.now()
    const trimmedMessage = message.trim()

    logAiDemoEvent('Express API received request', {
      route: 'POST /ai/portfolio-chat',
      promptCharacters: trimmedMessage.length,
      historyMessages: history.length,
    })

    logAiDemoEvent('Retrieving portfolio context', {
      route: 'POST /ai/portfolio-chat',
    })

    const retrievedChunks = await retrievePortfolioChunks(message)

    logAiDemoEvent('Portfolio context retrieved', {
      route: 'POST /ai/portfolio-chat',
      chunks: retrievedChunks.length,
    })

    const messages = buildPortfolioChatMessages({
      message,
      history: history as PortfolioHistoryMessage[],
      retrievedChunks,
    })

    logAiDemoEvent('Calling OpenAI chat completions API', {
      route: 'POST /ai/portfolio-chat',
      model: portfolioChatModel,
      messages: messages.length,
      chunks: retrievedChunks.length,
    })

    const completion = await getOpenAiClient().chat.completions.create({
      model: portfolioChatModel,
      messages,
    })

    const reply = completion.choices[0].message.content?.trim()

    if (!reply) {
      res.status(500).json({ error: 'The AI did not return a reply' })
      return
    }

    const dedupedSources = Array.from(
      new Map(
        retrievedChunks.map((chunk) => [
          chunk.documentId,
          {
            id: chunk.id,
            label: chunk.title,
          },
        ])
      ).values()
    )

    logAiDemoEvent('OpenAI response received', {
      route: 'POST /ai/portfolio-chat',
      model: portfolioChatModel,
      durationMs: getElapsedMs(startedAt),
      replyCharacters: reply.length,
      sources: dedupedSources.length,
    })

    res.json({
      reply,
      sources: dedupedSources,
    })
  } catch (error) {
    console.error(error)

    const messageText =
      error instanceof Error &&
      /ENOENT|no such file/i.test(error.message)
        ? 'Portfolio index not found. Run the portfolio ingestion script first.'
        : 'Error generating portfolio response'

    res.status(500).json({ error: messageText })
  }
})

export default router
