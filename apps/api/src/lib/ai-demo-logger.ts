type AiDemoLogDetails = Record<string, string | number | boolean | undefined>

function formatDetails(details: AiDemoLogDetails = {}) {
  return Object.entries(details)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')
}

export function logAiDemoEvent(message: string, details?: AiDemoLogDetails) {
  const suffix = details ? ` ${formatDetails(details)}` : ''

  console.log(`[AI Demo] ${message}${suffix}`)
}

export function getElapsedMs(startedAt: number) {
  return Math.round(performance.now() - startedAt)
}
