import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { portfolioIndexPath } from './paths.js'
import type { IndexedPortfolioChunk } from './types.js'

type PortfolioIndexFile = {
  generatedAt: string
  chunkCount: number
  chunks: IndexedPortfolioChunk[]
}

export async function loadPortfolioIndex(): Promise<IndexedPortfolioChunk[]> {
  const raw = await readFile(portfolioIndexPath, 'utf8')
  const parsed = JSON.parse(raw) as PortfolioIndexFile

  return parsed.chunks
}

export async function savePortfolioIndex(chunks: IndexedPortfolioChunk[]) {
  await mkdir(path.dirname(portfolioIndexPath), { recursive: true })

  const payload: PortfolioIndexFile = {
    generatedAt: new Date().toISOString(),
    chunkCount: chunks.length,
    chunks,
  }

  await writeFile(portfolioIndexPath, JSON.stringify(payload, null, 2))
}
