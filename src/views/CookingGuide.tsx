import { useEffect, useRef } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import type { FullRecipe, RecipeIdea } from '../types/recipe'

type CookingGuideProps = {
  selectedIdea: RecipeIdea
  activeRecipe: FullRecipe | null
  detailsLoading: boolean
  detailsError: string | null
  currentStep: number
  onBack: () => void
  onRetry: () => void
  onSelectStep: (stepIndex: number) => void
}

function CookingGuide({
  selectedIdea,
  activeRecipe,
  detailsLoading,
  detailsError,
  currentStep,
  onBack,
  onRetry,
  onSelectStep,
}: CookingGuideProps) {
  const touchStartY = useRef<number | null>(null)

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: currentStep,
    vertical: true,
    mode: 'snap',
    drag: false,
    rubberband: false,
    slides: { perView: 'auto', spacing: 12 },
  })

  useEffect(() => {
    if (!activeRecipe || !slider.current) return

    const currentSlide = slider.current.track.details.rel
    if (currentSlide !== currentStep) {
      slider.current.moveToIdx(currentStep, true)
    }
  }, [activeRecipe, currentStep, slider])

  const handleStepKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeRecipe) return

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault()
      onSelectStep(Math.min(currentStep + 1, activeRecipe.steps.length - 1))
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault()
      onSelectStep(Math.max(currentStep - 1, 0))
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!activeRecipe || touchStartY.current === null) return

    const endY = event.changedTouches[0]?.clientY
    if (typeof endY !== 'number') return

    const deltaY = endY - touchStartY.current
    touchStartY.current = null

    if (Math.abs(deltaY) < 40) return

    if (deltaY < 0) {
      onSelectStep(Math.min(currentStep + 1, activeRecipe.steps.length - 1))
      return
    }

    onSelectStep(Math.max(currentStep - 1, 0))
  }

  return (
    <section className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
      >
        Back
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          {activeRecipe?.title ?? selectedIdea.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {activeRecipe?.description ?? selectedIdea.description}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 lg:order-2">
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

          <div className="flex min-h-0 max-h-[calc(100dvh-16rem)] flex-col lg:order-1">
            <div className="min-h-0 flex-1">
              {detailsLoading && (
                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  Generating the full recipe...
                </p>
              )}
              {!detailsLoading && detailsError && (
                <div className="space-y-3 rounded-lg bg-slate-50 p-4">
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
                <div
                  ref={sliderRef}
                  className="recipe-step-slider keen-slider h-full min-h-0 overflow-hidden outline-none focus:outline-none focus-visible:outline-none"
                  onKeyDown={handleStepKeyDown}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  tabIndex={0}
                  aria-label="Recipe steps"
                >
                  {activeRecipe.steps.map((step, index) => {
                    const isActive = index === currentStep
                    return (
                      <button
                        key={`${index}-${step}`}
                        type="button"
                        onClick={() => onSelectStep(index)}
                        style={{ minHeight: 'auto' }}
                        className={`keen-slider__slide h-auto rounded-lg px-4 py-4 text-left transition-colors transition-opacity transition-shadow duration-200 outline-none focus:outline-none focus-visible:outline-none ${
                          isActive
                            ? 'border border-slate-900 bg-white shadow-md'
                            : 'border border-transparent bg-transparent opacity-70'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Step {index + 1}
                        </p>
                        <p
                          className={`mt-2 leading-relaxed transition-colors ${
                            isActive ? 'text-sm font-normal text-slate-900' : 'text-sm font-normal text-slate-700'
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default CookingGuide
