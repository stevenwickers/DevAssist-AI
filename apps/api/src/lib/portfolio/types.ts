export type PortfolioDocument = {
  id: string
  title: string
  path: string
  text: string
}

export type PortfolioChunk = {
  id: string
  documentId: string
  title: string
  path: string
  text: string
}

export type IndexedPortfolioChunk = PortfolioChunk & {
  embedding: number[]
}

export type RetrievedPortfolioChunk = IndexedPortfolioChunk & {
  score: number
}
