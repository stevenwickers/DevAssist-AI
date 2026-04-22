import type { SummarizeRequest, SummarizeResponse } from './types.ts'

export async function summarizeTextMock(
  request: SummarizeRequest
): Promise<SummarizeResponse> {
  const { text, tone } = request

  await new Promise((resolve) => setTimeout(resolve, 1200))

  const preview = text.length > 220 ? `${text.slice(0, 220)}...` : text

  return {
    summary: `This is a ${tone} summary of the provided content. The text discusses core ideas, important context, and notable follow-up opportunities. Preview: ${preview}`,
    keyTakeaways: [
      'The content contains several important ideas that can be condensed for quick review.',
      'There are a few recurring themes or priorities worth highlighting.',
      'A summarized format makes the information easier to act on and share.',
    ],
    actionItems: [
      'Review the summarized content for accuracy.',
      'Identify the most urgent next step from the key takeaways.',
      'Share the summary with stakeholders or save it for later reference.',
    ],
  }
}
