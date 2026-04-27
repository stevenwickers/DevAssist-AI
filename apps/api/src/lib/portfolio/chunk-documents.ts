import type { PortfolioChunk, PortfolioDocument } from './types.js'

const DEFAULT_CHUNK_SIZE = 900
const DEFAULT_CHUNK_OVERLAP = 150

function normalizeWhitespace(value: string) {
  return value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

function splitIntoParagraphs(text: string) {
  return normalizeWhitespace(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

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
