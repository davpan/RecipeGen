const BASIC_AUTH_STORAGE_KEY = 'recipegen.basic_auth'

type ProxyResponse = {
  text?: string
  error?: string
}

let cachedAuthorization: string | null = null
let attemptedInitialPrompt = false

function clearSavedCredentials() {
  cachedAuthorization = null
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(BASIC_AUTH_STORAGE_KEY)
  }
}

function getAuthorizationHeader(): string {
  if (cachedAuthorization) {
    return cachedAuthorization
  }

  if (typeof window === 'undefined') {
    throw new Error('Cannot prompt for credentials outside the browser.')
  }

  const saved = window.localStorage.getItem(BASIC_AUTH_STORAGE_KEY)
  if (saved) {
    cachedAuthorization = `Basic ${saved}`
    return cachedAuthorization
  }

  const password = window.prompt('RecipeGen password')
  if (!password) {
    throw new Error('Password is required to use this app.')
  }

  const encoded = window.btoa(`:${password}`)
  window.localStorage.setItem(BASIC_AUTH_STORAGE_KEY, encoded)
  cachedAuthorization = `Basic ${encoded}`
  return cachedAuthorization
}

export function preloadGeminiAuth() {
  if (attemptedInitialPrompt) {
    return
  }

  attemptedInitialPrompt = true
  try {
    getAuthorizationHeader()
  } catch {
    // User can retry on first generate action.
  }
}

export async function generateGeminiJson(promptText: string): Promise<string> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthorizationHeader(),
    },
    body: JSON.stringify({ promptText }),
  })

  if (!response.ok) {
    let message = `Request failed (${response.status}).`

    try {
      const payload = (await response.json()) as ProxyResponse
      if (payload.error) {
        message = payload.error
      }
    } catch {
      // Ignore parse errors and keep generic message.
    }

    if (response.status === 401) {
      clearSavedCredentials()
      throw new Error('Unauthorized. Check your password and try again.')
    }

    throw new Error(message)
  }

  const payload = (await response.json()) as ProxyResponse
  if (!payload.text) {
    throw new Error('Gemini proxy returned an empty response.')
  }

  return payload.text
}
