export type ApiStatus = {
  openAiConfigured: boolean;
};

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export async function getApiStatus(): Promise<ApiStatus> {
  const response = await fetch(`${apiUrl}/ai/status`)

  if (!response.ok) {
    throw new Error('Unable to read API status.')
  }

  return (await response.json()) as ApiStatus
}
