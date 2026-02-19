type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

type GeminiErrorResponse = {
  error?: {
    code?: number
    message?: string
    status?: string
  }
}

export async function generateGeminiJson(promptText: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const model = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash'

  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in environment variables.')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    },
  )

  if (!response.ok) {
    let details = ''
    try {
      const err = (await response.json()) as GeminiErrorResponse
      details = err.error?.message ? ` ${err.error.message}` : ''
    } catch {
      // Ignore parse errors and fall back to status-only message.
    }
    throw new Error(`Gemini request failed (${response.status}).${details}`)
  }

  const data = (await response.json()) as GeminiResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Gemini returned an empty response.')
  }

  return text
}
