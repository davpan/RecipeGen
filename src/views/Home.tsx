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
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-8 font-display text-4xl lg:text-6xl text-charcoal italic tracking-tight">
          RecipeGen
        </h1>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="relative">
            <label
              htmlFor="prompt"
              className="mb-4 block font-display text-xl text-charcoal/80"
            >
              What are we cooking today?
            </label>
            <textarea
              id="prompt"
              var-variant="print"
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="e.g., A celebratory spring dinner with seasonal vegetables..."
              className="min-h-32 w-full resize-none bg-transparent border-t border-b border-charcoal/10 py-4 text-lg font-serif italic text-charcoal outline-none transition-colors focus:border-charcoal/40 placeholder:text-charcoal/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="btn-print w-auto mx-auto px-12"
          >
            {loading ? 'Consulting the archives...' : 'Generate Ideas'}
          </button>
          {error && (
            <p className="mt-4 font-sans text-sm tracking-wide text-red-800 uppercase italic">
              {error}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Home
