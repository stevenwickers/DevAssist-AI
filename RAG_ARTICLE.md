# How to Implement AI and Create a RAG Application with React and OpenAI

Retrieval-Augmented Generation, usually shortened to RAG, is one of the most practical ways to make an AI application useful with your own data. Instead of asking a model to answer from memory, a RAG app retrieves relevant documents first, gives those documents to the model as context, and asks the model to answer only from that context.

This article walks through the RAG portion of DevAssist AI, a React and Express application that lets users ask questions about a portfolio. The same pattern can be used for documentation assistants, internal knowledge bases, product support bots, onboarding tools, and any application where answers need to be grounded in private or application-specific data.

## What We Are Building

The RAG flow in this application has five parts:

1. Store source content as Markdown files.
2. Split those files into smaller chunks.
3. Generate embeddings for each chunk with OpenAI.
4. Retrieve the most relevant chunks for a user's question.
5. Send the retrieved context to an OpenAI chat model and render the answer in React.

At a high level, the data flow looks like this:

```text
Markdown files
  -> chunk documents
  -> create embeddings
  -> save vector index
  -> embed user question
  -> rank chunks by similarity
  -> build prompt with retrieved context
  -> generate answer
  -> show answer and sources in React
```

## Project Structure

The RAG code is split between the API and the React frontend:

```text
apps/api/src/lib/portfolio/
  build-portfolio-chat-messages.ts
  chunk-documents.ts
  embeddings.ts
  index-store.ts
  load-documents.ts
  paths.ts
  retrieve-chunks.ts
  types.ts

apps/api/src/routes/
  portfolio-chat.ts

apps/api/src/scripts/
  ingest-portfolio.ts

apps/web/src/features/portfolio-chat/
  api/portfolio-chat-api.ts
  components/PortfolioChatForm.tsx
  components/PortfolioChatMessages.tsx
  pages/PortfolioChatPage.tsx
  types.ts

data/portfolio/
  notes/
  projects/

data/portfolio-index.json
```

The backend owns the OpenAI key, document ingestion, embeddings, retrieval, and final model call. The React app only sends the user's message and recent chat history to the API.

That separation matters. OpenAI API keys should stay on the server, never in browser-side React code.

## Step 1: Load Portfolio Documents

The application keeps its knowledge base as Markdown files under `data/portfolio`. Each file becomes a `PortfolioDocument` with an ID, title, path, and text.

```ts
// apps/api/src/lib/portfolio/load-documents.ts
export async function loadPortfolioDocuments(): Promise<PortfolioDocument[]> {
  const markdownFiles = await collectMarkdownFiles(portfolioDataDir)

  if (!markdownFiles.length) {
    throw new Error(
      `No portfolio markdown documents were found in ${portfolioDataDir}.`
    )
  }

  const documents = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const text = await readFile(filePath, 'utf8')
      const relativePath = path.relative(portfolioDataDir, filePath)
      const fallbackTitle = path.basename(filePath, '.md')

      return {
        id: slugify(relativePath.replace(/\.md$/i, '')),
        title: titleFromMarkdown(text, fallbackTitle),
        path: relativePath,
        text,
      }
    })
  )

  return documents.sort((left, right) => left.path.localeCompare(right.path))
}
```

This approach keeps the first version of the app simple. There is no database requirement just to prove the architecture. The source of truth is readable Markdown, which is easy to update and easy to version control.

## Step 2: Chunk the Documents

Large documents are not ideal retrieval units. If a full Markdown file contains several topics, retrieving the whole file can add noise to the prompt. Instead, the app splits documents into smaller chunks.

```ts
// apps/api/src/lib/portfolio/chunk-documents.ts
const DEFAULT_CHUNK_SIZE = 900
const DEFAULT_CHUNK_OVERLAP = 150

export function chunkPortfolioDocuments(
  documents: PortfolioDocument[],
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP
): PortfolioChunk[] {
  const chunks: PortfolioChunk[] = []

  documents.forEach((document) => {
    const paragraphs = splitIntoParagraphs(document.text)
    const chunkTexts: string[] = []
    let currentChunk = ''

    paragraphs.forEach((paragraph) => {
      const nextChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph

      if (nextChunk.length <= chunkSize) {
        currentChunk = nextChunk
        return
      }

      if (currentChunk) {
        chunkTexts.push(currentChunk)
        const overlapText = currentChunk.slice(-chunkOverlap).trim()
        currentChunk = overlapText ? `${overlapText}\n\n${paragraph}` : paragraph
        return
      }

      chunkTexts.push(paragraph)
      currentChunk = ''
    })

    if (currentChunk) {
      chunkTexts.push(currentChunk)
    }

    chunkTexts.forEach((text, index) => {
      chunks.push({
        id: `${document.id}-${index + 1}`,
        documentId: document.id,
        title: document.title,
        path: document.path,
        text,
      })
    })
  })

  return chunks
}
```

The overlap is important. Without overlap, a useful sentence at the boundary between two chunks might lose its surrounding context. A small overlap helps preserve meaning while still keeping each chunk focused.

## Step 3: Create Embeddings with OpenAI

An embedding turns text into a vector, which is a list of numbers that represents semantic meaning. Text with similar meaning should have vectors that are close together. OpenAI's embeddings API is designed for use cases like search, clustering, recommendations, and classification.

This app uses `text-embedding-3-small` by default:

```ts
// apps/api/src/lib/portfolio/embeddings.ts
import OpenAI from 'openai'

const embeddingModel =
  process.env.PORTFOLIO_EMBEDDING_MODEL ?? 'text-embedding-3-small'

function getOpenAiClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAiClient()
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: text,
  })

  return response.data[0].embedding
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) {
    return []
  }

  const openai = getOpenAiClient()
  const response = await openai.embeddings.create({
    model: embeddingModel,
    input: texts,
  })

  return response.data.map((item) => item.embedding)
}
```

There are two helper functions:

- `embedText` embeds one user question at request time.
- `embedTexts` embeds many document chunks during ingestion.

Batching the document chunks in `embedTexts` keeps ingestion cleaner and avoids making one API request per chunk.

## Step 4: Build the Vector Index

The ingestion script turns Markdown documents into a local JSON index. This is the offline preparation step.

```ts
// apps/api/src/scripts/ingest-portfolio.ts
async function main() {
  const documents = await loadPortfolioDocuments()
  const chunks = chunkPortfolioDocuments(documents)
  const embeddings = await embedTexts(chunks.map((chunk) => chunk.text))

  const indexedChunks = chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index],
  }))

  await savePortfolioIndex(indexedChunks)

  console.log(
    `Portfolio index generated with ${documents.length} documents and ${indexedChunks.length} chunks.`
  )
}
```

Run it from the root of the repo:

```bash
npm run ingest:portfolio
```

The index is saved to `data/portfolio-index.json`:

```ts
// apps/api/src/lib/portfolio/index-store.ts
export async function savePortfolioIndex(chunks: IndexedPortfolioChunk[]) {
  await mkdir(path.dirname(portfolioIndexPath), { recursive: true })

  const payload: PortfolioIndexFile = {
    generatedAt: new Date().toISOString(),
    chunkCount: chunks.length,
    chunks,
  }

  await writeFile(portfolioIndexPath, JSON.stringify(payload, null, 2))
}
```

For a production system, this JSON file could be replaced by a vector database such as PostgreSQL with pgvector, Pinecone, Qdrant, Weaviate, or another vector store. For a focused proof of concept, a JSON index is a great place to start because it makes the retrieval logic transparent.

## Step 5: Retrieve Relevant Chunks

When the user asks a question, the app embeds the question and compares that vector to the stored chunk vectors.

```ts
// apps/api/src/lib/portfolio/retrieve-chunks.ts
function cosineSimilarity(left: number[], right: number[]) {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index]
    leftNorm += left[index] * left[index]
    rightNorm += right[index] * right[index]
  }

  if (!leftNorm || !rightNorm) {
    return 0
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
}
```

Cosine similarity measures how close two vectors are by comparing their direction. The app scores every chunk and keeps the top matches:

```ts
// apps/api/src/lib/portfolio/retrieve-chunks.ts
export async function retrievePortfolioChunks(
  question: string,
  limit = 4
): Promise<RetrievedPortfolioChunk[]> {
  const [chunks, questionEmbedding] = await Promise.all([
    loadPortfolioIndex(),
    embedText(question),
  ])

  return rankChunks(chunks, questionEmbedding, limit)
}
```

The `limit = 4` value is a practical default. It gives the model enough context to answer without stuffing the prompt with too much unrelated material.

## Step 6: Build a Grounded Chat Prompt

Retrieval alone is not enough. The model needs clear instructions about how to use the retrieved content.

```ts
// apps/api/src/lib/portfolio/build-portfolio-chat-messages.ts
export function buildPortfolioChatMessages(params: {
  message: string
  history: HistoryMessage[]
  retrievedChunks: RetrievedChunk[]
}) {
  const { message, history, retrievedChunks } = params
  const recentHistory = history.slice(-6)
  const contextBlock = retrievedChunks
    .map(
      (chunk) =>
        `[Source: ${chunk.title} | Chunk ID: ${chunk.id} | Path: ${chunk.path}]\n${chunk.text}`
    )
    .join('\n\n')

  return [
    {
      role: 'system' as const,
      content:
        'You are a portfolio assistant for Steven Wickers. Answer using only the retrieved portfolio context and the recent conversation. If the context does not support a claim, say that the available portfolio documents do not provide enough evidence. Keep the answer concise, professional, and specific. When helpful, mention the source titles naturally in the answer.',
    },
    ...(recentHistory.length
      ? [
          {
            role: 'system' as const,
            content: `Recent conversation:\n${recentHistory
              .map((entry) => `${entry.role}: ${entry.content}`)
              .join('\n')}`,
          },
        ]
      : []),
    {
      role: 'system' as const,
      content: `Retrieved portfolio context:\n${contextBlock}`,
    },
    {
      role: 'user' as const,
      content: message,
    },
  ]
}
```

There are three important details here:

- The assistant is told to answer only from retrieved context.
- Recent chat history is included, but limited to the last six messages.
- Each retrieved chunk includes source metadata, which makes the answer easier to audit.

This is where RAG becomes more than search. The search result becomes structured context inside the prompt.

## Step 7: Create the API Route

The Express route receives the user's message and history, validates the request, retrieves chunks, calls OpenAI, and returns the answer plus source labels.

```ts
// apps/api/src/routes/portfolio-chat.ts
router.post('/portfolio-chat', portfolioRateLimit, async (req, res) => {
  const { message, history } = req.body as {
    message?: unknown
    history?: unknown
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
    const retrievedChunks = await retrievePortfolioChunks(message)
    const completion = await openai.chat.completions.create({
      model: portfolioChatModel,
      messages: buildPortfolioChatMessages({
        message,
        history: history as PortfolioHistoryMessage[],
        retrievedChunks,
      }),
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
```

The default chat model is configured with an environment variable:

```ts
const portfolioChatModel = process.env.PORTFOLIO_CHAT_MODEL ?? 'gpt-4o-mini'
```

The route also uses rate limiting. This matters because AI endpoints can be expensive, and public-facing chat forms are easy to abuse.

## Step 8: Call the RAG API from React

The React app sends the current message and chat history to the backend. Notice that the browser never calls OpenAI directly.

```ts
// apps/web/src/features/portfolio-chat/api/portfolio-chat-api.ts
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export async function sendPortfolioChat(
  request: PortfolioChatRequest
): Promise<PortfolioChatResponse> {
  const response = await fetch(`${apiUrl}/ai/portfolio-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: request.message,
      history: request.history.map((item) => ({
        role: item.role,
        content: item.content,
      })),
    }),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: string }
      | null

    throw new Error(errorBody?.error ?? 'Failed to call the portfolio chat API.')
  }

  const data = (await response.json()) as PortfolioChatResponse

  return {
    reply: data.reply,
    sources: data.sources,
  }
}
```

The page component manages the conversation state:

```tsx
// apps/web/src/features/portfolio-chat/pages/PortfolioChatPage.tsx
const handleSend = async () => {
  const trimmed = input.trim()
  if (!trimmed) return

  const nextUserMessage = createMessage('user', trimmed)

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

    setMessages((prev) => [...prev, errorMessage])
  } finally {
    setIsLoading(false)
  }
}
```

The UI then renders assistant messages and source badges:

```tsx
// apps/web/src/features/portfolio-chat/components/PortfolioChatMessages.tsx
{!isUser && message.sources?.length ? (
  <div className="mt-4 flex flex-wrap gap-2">
    {message.sources.map((source) => (
      <Badge key={source.id} variant="secondary">
        {source.label}
      </Badge>
    ))}
  </div>
) : null}
```

Those source badges are small, but they are an important trust signal. They show the user which portfolio documents shaped the response.

## Running the RAG Application Locally

Create an `.env` file for the API with your OpenAI key:

```bash
OPENAI_API_KEY=your_api_key_here
PORTFOLIO_EMBEDDING_MODEL=text-embedding-3-small
PORTFOLIO_CHAT_MODEL=gpt-4o-mini
```

Install dependencies:

```bash
npm install
```

Generate the portfolio index:

```bash
npm run ingest:portfolio
```

Start the API and React app:

```bash
npm run dev
```

Then open the React app and ask a question such as:

```text
What backend API experience does Steven have?
```

The API will retrieve relevant portfolio chunks, pass them to the chat model, and return a grounded answer with source labels.

## Why This RAG Design Works

This implementation is intentionally simple, which makes it useful as a learning example.

It does not require a vector database to understand the core architecture. It keeps the OpenAI key on the server. It separates ingestion from runtime chat. It returns source metadata to the UI. And it gives the model strict instructions to answer only from retrieved context.

Those choices are the foundation of a reliable RAG app.

## Production Improvements

Once the proof of concept is working, the next improvements are straightforward:

- Replace the JSON vector index with a real vector database.
- Add tests around chunking, retrieval ranking, and API validation.
- Add score thresholds so weak retrieval results trigger an "I do not know" response.
- Stream the assistant response to React for a faster-feeling chat experience.
- Track token usage and latency.
- Add document refresh workflows when portfolio content changes.
- Store source URLs or file paths so the UI can link directly to the underlying document.
- Remove development-only statements such as `debugger` before production builds.

## Conclusion

A RAG application is not just a chat box connected to a model. It is a pipeline:

```text
prepare knowledge -> retrieve relevant context -> generate grounded answers
```

In DevAssist AI, React handles the user experience, Express owns the API boundary, OpenAI embeddings power semantic search, and the chat model turns retrieved context into a useful answer.

That pattern is small enough to build quickly, but strong enough to grow into a production knowledge assistant.

## References

- OpenAI embeddings guide: https://platform.openai.com/docs/guides/embeddings
- OpenAI embeddings API reference: https://platform.openai.com/docs/api-reference/embeddings
- OpenAI Chat Completions API reference: https://platform.openai.com/docs/api-reference/chat/create-chat-completion
- OpenAI API authentication guidance: https://platform.openai.com/docs/api-reference/introduction
