import type { RecipeIdea } from '../types/recipe'

type RecipeCardProps = {
  idea: RecipeIdea
  onSelect: (idea: RecipeIdea) => void
}

function RecipeCard({ idea, onSelect }: RecipeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(idea)}
      className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-400"
    >
      <h2 className="text-lg font-semibold text-slate-900">{idea.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{idea.description}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-700">
        <div>
          <dt className="text-slate-500">Prep</dt>
          <dd>{idea.prepTime}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Cook</dt>
          <dd>{idea.cookTime}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Difficulty</dt>
          <dd>{idea.difficulty}</dd>
        </div>
      </dl>
    </button>
  )
}

export default RecipeCard
