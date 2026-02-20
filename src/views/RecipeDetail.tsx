import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import type { FullRecipe, RecipeIdea } from '../types/recipe'

type RecipeDetailProps = {
  selectedIdea: RecipeIdea
  activeRecipe: FullRecipe | null
  detailsLoading: boolean
  detailsError: string | null
  onBack: () => void
  onRetry: () => void
}

function RecipeDetail({
  selectedIdea,
  activeRecipe,
  detailsLoading,
  detailsError,
  onBack,
  onRetry,
}: RecipeDetailProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    vertical: true,
    mode: 'snap',
    drag: false,
    rubberband: false,
    slides: { perView: 'auto', spacing: 12 },
  })

  return (
    <section className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center border-b border-charcoal/10 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="btn-print"
        >
          &larr; Return to Library
        </button>
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
          Archival Series № 042
        </span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
        {/* Left Column: Meta & Ingredients */}
        <aside className="space-y-12">
          <div>
            <h1 className="font-display text-4xl text-charcoal italic leading-tight">
              {activeRecipe?.title ?? selectedIdea.title}
            </h1>
            <p className="mt-4 font-serif text-base leading-relaxed text-charcoal/70 italic">
              {activeRecipe?.description ?? selectedIdea.description}
            </p>
          </div>

          <div className="pt-8 border-t border-charcoal/10">
            <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal mb-6">
              Ingredients
            </h2>
            {activeRecipe ? (
              <ul className="space-y-4 font-serif text-sm text-charcoal/80">
                {activeRecipe.ingredients.map((ingredient) => (
                  <li key={ingredient} className="pb-2 border-b border-charcoal/5 last:border-0">
                    {ingredient}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="font-serif text-sm text-charcoal/40 italic">
                {detailsLoading ? 'Cataloging ingredients...' : 'Ingredients pending selection.'}
              </div>
            )}
          </div>
        </aside>

        {/* Right Column: Steps */}
        <div className="min-h-0">
          <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal mb-6">
            Method & Instructions
          </h2>

          <div className="flex flex-col h-auto">
            {detailsLoading && (
              <div className="font-serif text-lg text-charcoal/50 italic animate-pulse">
                Drafting the procedure...
              </div>
            )}
            {!detailsLoading && detailsError && (
              <div className="p-8 border border-red-800/10 bg-red-50/30 text-center">
                <p className="font-serif text-red-900 italic mb-4">{detailsError}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="btn-print border-red-900 text-red-900 font-bold"
                >
                  Attempt Recovery
                </button>
              </div>
            )}
            {!detailsLoading && !detailsError && activeRecipe && (
              <div
                ref={sliderRef}
                className="recipe-step-slider keen-slider h-auto min-h-0 overflow-hidden outline-none"
                aria-label="Recipe steps"
              >
                {activeRecipe.steps.map((step, index) => {
                  const isLastStep = index === activeRecipe.steps.length - 1
                  return (
                    <div
                      key={`${index}-${step}`}
                      className={`keen-slider__slide h-auto text-left px-1 outline-none opacity-100 ${isLastStep ? 'pt-6 pb-0' : 'py-6'}`}
                    >
                      <div className="flex gap-6 items-start">
                        <span className="font-display text-4xl text-charcoal/20 italic tabular-nums leading-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="font-serif text-lg leading-relaxed text-charcoal pt-1">
                          {step}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecipeDetail
