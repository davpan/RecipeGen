# RecipeGen

Simple recipe generator web app built with TypeScript, Vite, React, and Tailwind CSS.

## Features

- Home screen with a single cooking prompt box
- Gemini-generated screen with 4 recipe idea cards
- Cooking mode with step-by-step guided UI
- Serverless Gemini proxy with HTTP Basic Auth gate

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (`.env` for local Netlify dev, or Netlify site env vars in production):

```bash
cp .env.example .env
```

Required vars:

- `GEMINI_API_KEY`
- `APP_BASIC_AUTH_PASS`

Optional:

- `GEMINI_MODEL` (defaults to `gemini-2.5-flash`)

3. Run locally with Netlify so `/api/generate` is available:

```bash
npx netlify dev
```

The app will prompt for password as soon as the app loads.

## Build

```bash
npm run build
```
