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
      className="card-print text-left"
    >
      <h2 className="font-display text-xl text-charcoal italic">{idea.title}</h2>
      <p className="mt-3 font-serif text-sm leading-relaxed text-charcoal/70">{idea.description}</p>
      <div className="mt-6 flex gap-6 font-sans text-[10px] uppercase tracking-widest text-charcoal/50">
        <div className="flex gap-2">
          <span className="font-bold">Prep</span>
          <span>{idea.prepTime}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Cook</span>
          <span>{idea.cookTime}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold">Level</span>
          <span>{idea.difficulty}</span>
        </div>
      </div>
    </button>
  )
}

export default RecipeCard
