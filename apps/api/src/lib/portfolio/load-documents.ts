import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { portfolioDataDir } from './paths.js'
import type { PortfolioDocument } from './types.js'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function titleFromMarkdown(markdown: string, fallback: string) {
  const heading = markdown
    .split('\n')
    .find((line) => line.trim().startsWith('# '))
    ?.replace(/^#\s+/, '')
    .trim()

  return heading || fallback
}

async function collectMarkdownFiles(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const nextPath = path.join(dirPath, entry.name)

      if (entry.isDirectory()) {
        return collectMarkdownFiles(nextPath)
      }

      return nextPath.endsWith('.md') ? [nextPath] : []
    })
  )

  return files.flat()
}

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
