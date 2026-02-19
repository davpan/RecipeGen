import { useLayoutEffect, useRef } from 'react'
import type { FullRecipe, RecipeIdea } from '../types/recipe'

type CookingGuideProps = {
  selectedIdea: RecipeIdea
  activeRecipe: FullRecipe | null
  detailsLoading: boolean
  detailsError: string | null
  currentStep: number
  totalSteps: number
  progress: number
  onBack: () => void
  onRetry: () => void
  onPrevStep: () => void
  onNextStep: () => void
  onSelectStep: (stepIndex: number) => void
}

function CookingGuide({
  selectedIdea,
  activeRecipe,
  detailsLoading,
  detailsError,
  currentStep,
  totalSteps,
  progress,
  onBack,
  onRetry,
  onPrevStep,
  onNextStep,
  onSelectStep,
}: CookingGuideProps) {
  const stepListRef = useRef<HTMLDivElement | null>(null)
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([])

  useLayoutEffect(() => {
    if (!activeRecipe) return

    const stepElement = stepRefs.current[currentStep]
    if (!stepElement) return

    stepElement.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'auto',
    })
  }, [activeRecipe, currentStep])

  return (
    <section className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
      >
        Back to ideas
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {activeRecipe?.title ?? selectedIdea.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {activeRecipe?.description ?? selectedIdea.description}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Ingredients</h2>
            {activeRecipe ? (
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                {activeRecipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Ingredients will appear once the recipe is ready.</p>
            )}
          </aside>

          <div>
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>{activeRecipe ? `Step ${currentStep + 1} of ${totalSteps}` : 'Preparing recipe'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-slate-900" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              {detailsLoading && <p className="text-sm text-slate-600">Generating the full recipe...</p>}
              {!detailsLoading && detailsError && (
                <div className="space-y-3">
                  <p className="text-sm text-red-600">{detailsError}</p>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!detailsLoading && !detailsError && activeRecipe && (
                <div ref={stepListRef} className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                  {activeRecipe.steps.map((step, index) => {
                    const isActive = index === currentStep
                    return (
                      <button
                        key={`${index}-${step}`}
                        ref={(element) => {
                          stepRefs.current[index] = element
                        }}
                        type="button"
                        onClick={() => onSelectStep(index)}
                        className={`w-full rounded-lg border px-4 py-4 text-left transition-colors transition-shadow ${
                          isActive
                            ? 'border-slate-900 bg-white shadow-sm'
                            : 'border-slate-200 bg-slate-100/70 opacity-85 hover:opacity-100'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Step {index + 1}
                        </p>
                        <p
                          className={`mt-2 text-base leading-relaxed transition-colors ${
                            isActive ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                          }`}
                        >
                          {step}
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={onPrevStep}
                disabled={!activeRecipe || currentStep === 0}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={onNextStep}
                disabled={!activeRecipe || currentStep === totalSteps - 1}
                className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CookingGuide
