import express from 'express'
import OpenAI from 'openai'
import { getElapsedMs, logAiDemoEvent } from '../lib/ai-demo-logger.js'
import { createRateLimit } from '../middleware/rate-limit.js'

const router = express.Router();
const maxPromptCharacters = Number(process.env.AI_MAX_PROMPT_CHARACTERS) || 12000
const aiRateLimit = createRateLimit({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60_000,
  maxRequests: Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 10,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const askModel = process.env.AI_ASK_MODEL ?? 'gpt-4o-mini'

/**
 * @swagger
 * components:
 *   schemas:
 *     AskRequest:
 *       type: object
 *       required:
 *         - prompt
 *       properties:
 *         prompt:
 *           type: string
 *           description: The prompt to send to the AI model.
 *           example: Explain React hooks in one paragraph.
 *     AskResponse:
 *       type: object
 *       properties:
 *         reply:
 *           type: string
 *           description: The AI-generated response.
 *           example: React hooks let function components manage state and side effects.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: prompt is required
 */

/**
 * @swagger
 * /ai/ask:
 *   post:
 *     summary: Ask the AI model a question
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AskRequest'
 *     responses:
 *       200:
 *         description: AI response generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AskResponse'
 *       400:
 *         description: Missing prompt in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       413:
 *         description: Prompt is too large.
 *       429:
 *         description: Too many AI requests.
 *       500:
 *         description: Error communicating with OpenAI.
 */
router.post('/ask', aiRateLimit, async (req, res) => {
  const { prompt } = req.body

  if (typeof prompt !== 'string') {
    res.status(400).json({ error: 'prompt is required' })
    return
  }

  const trimmedPrompt = prompt.trim()

  if (!trimmedPrompt) {
    res.status(400).json({ error: 'prompt is required' })
    return
  }

  if (trimmedPrompt.length > maxPromptCharacters) {
    res.status(413).json({
      error: `Prompt needs to be less than ${maxPromptCharacters.toLocaleString()} characters`,
    })
    return
  }

  try {
    const startedAt = performance.now()

    logAiDemoEvent('Express API received request', {
      route: 'POST /ai/ask',
      promptCharacters: trimmedPrompt.length,
    })

    logAiDemoEvent('Calling OpenAI chat completions API', {
      route: 'POST /ai/ask',
      model: askModel,
      messages: 1,
    })

    const completion = await openai.chat.completions.create({
      model: askModel,
      messages: [{ role: 'user', content: trimmedPrompt }],
    })

    const reply = completion.choices[0].message.content

    logAiDemoEvent('OpenAI response received', {
      route: 'POST /ai/ask',
      model: askModel,
      durationMs: getElapsedMs(startedAt),
      replyCharacters: reply?.length ?? 0,
    })

    res.json({ reply })
  } catch (error) {
    logAiDemoEvent('OpenAI request failed', {
      route: 'POST /ai/ask',
    })
    console.error(error)
    res.status(500).send('Error communicating with OpenAI')
  }
})

export default router
