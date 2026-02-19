import type { FormEvent } from 'react'

type HomeProps = {
  prompt: string
  loading: boolean
  error: string | null
  onPromptChange: (nextPrompt: string) => void
  onSubmit: (event: FormEvent) => void
}

function Home({ prompt, loading, error, onPromptChange, onSubmit }: HomeProps) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <label htmlFor="prompt" className="mb-3 block text-lg font-semibold text-slate-900">
          What are we cooking?
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Example: high-protein vegetarian dinner in under 30 minutes"
          className="min-h-36 w-full resize-y rounded-lg border border-slate-300 p-3 text-base outline-none transition focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Generating recipe ideas...' : 'Generate Ideas'}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>
    </section>
  )
}

export default Home
