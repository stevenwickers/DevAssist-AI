import { chunkPortfolioDocuments } from '../lib/portfolio/chunk-documents.js'
import { embedTexts } from '../lib/portfolio/embeddings.js'
import { savePortfolioIndex } from '../lib/portfolio/index-store.js'
import { loadPortfolioDocuments } from '../lib/portfolio/load-documents.js'

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

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
