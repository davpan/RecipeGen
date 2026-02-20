const DEFAULT_MODEL = 'gemini-2.5-flash'

function unauthorized() {
  return {
    statusCode: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="RecipeGen"',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Unauthorized' }),
  }
}

function hasValidBasicAuth(event) {
  const expectedPass = process.env.APP_BASIC_AUTH_PASS

  if (!expectedPass) {
    return false
  }

  const authHeader = event.headers.authorization || event.headers.Authorization
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  try {
    const encoded = authHeader.slice('Basic '.length)
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    const separatorIndex = decoded.indexOf(':')

    if (separatorIndex === -1) {
      return false
    }

    const pass = decoded.slice(separatorIndex + 1)
    return pass === expectedPass
  } catch {
    return false
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  if (!hasValidBasicAuth(event)) {
    return unauthorized()
  }

  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing GEMINI_API_KEY on server.' }),
    }
  }

  let promptText
  try {
    const body = JSON.parse(event.body || '{}')
    promptText = body.promptText
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body.' }),
    }
  }

  if (typeof promptText !== 'string' || promptText.trim().length === 0) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'promptText is required.' }),
    }
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
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
      const errorPayload = await response.json()
      details = errorPayload?.error?.message || ''
    } catch {
      // Ignore parse failures.
    }

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Gemini request failed.${details ? ` ${details}` : ''}` }),
    }
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Gemini returned an empty response.' }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }
}
