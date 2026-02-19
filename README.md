# RecipeGen

Simple recipe generator web app built with TypeScript, Vite, React, and Tailwind CSS.

## Features

- Home screen with a single cooking prompt box
- Gemini-generated screen with 4 recipe idea cards
- Cooking mode with step-by-step guided UI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables:

```bash
cp .env.example .env
```

Then set `VITE_GEMINI_API_KEY` in `.env`.

3. Run locally:

```bash
npm run dev
```

## Build

```bash
npm run build
```
