import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

export const repoRoot = path.resolve(currentDir, '../../../../../')
export const portfolioDataDir = path.join(repoRoot, 'data', 'portfolio')
export const portfolioIndexPath = path.join(repoRoot, 'data', 'portfolio-index.json')
