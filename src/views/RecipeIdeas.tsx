import RecipeCard from '../components/RecipeCard'
import type { RecipeIdea } from '../types/recipe'

type RecipeIdeasProps = {
  submittedPrompt: string
  ideas: RecipeIdea[]
  loading: boolean
  error: string | null
  onGenerateNew: () => void
  onEditPrompt: () => void
  onSelectIdea: (idea: RecipeIdea) => void
}

function RecipeIdeas({
  submittedPrompt,
  ideas,
  loading,
  error,
  onGenerateNew,
  onEditPrompt,
  onSelectIdea,
}: RecipeIdeasProps) {
  return (
    <section className="max-w-4xl mx-auto py-8">
      <header className="mb-12 flex flex-col items-center gap-6 border-b border-charcoal/10 pb-8">
        <h1 className="font-display text-3xl text-charcoal italic text-center">
          {submittedPrompt}
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onEditPrompt}
            className="btn-print"
          >
            Refine Search
          </button>
          <button
            type="button"
            onClick={onGenerateNew}
            disabled={loading}
            className="btn-print"
          >
            {loading ? 'Searching...' : 'More Ideas'}
          </button>
        </div>
      </header>
      {error && (
        <p className="mb-8 font-sans text-sm uppercase tracking-widest text-red-800 italic text-center">
          {error}
        </p>
      )}
      {loading && ideas.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Generating recipe ideas...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <RecipeCard key={idea.id} idea={idea} onSelect={onSelectIdea} />
          ))}
        </div>
      )}
    </section>
  )
}

export default RecipeIdeas
