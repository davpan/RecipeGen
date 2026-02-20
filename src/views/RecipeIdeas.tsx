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
    <section>
      <header className="mb-6 grid grid-cols-[auto,1fr,auto] items-center gap-3">
        <button
          type="button"
          onClick={onEditPrompt}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          Back
        </button>
        <h1 className="text-center text-xl font-semibold text-slate-900">{submittedPrompt}</h1>
        <button
          type="button"
          onClick={onGenerateNew}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Generating...' : 'Refresh'}
        </button>
      </header>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
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
