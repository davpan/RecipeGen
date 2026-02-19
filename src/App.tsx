import { FormEvent, useMemo, useState } from 'react'
import Home from './views/Home'
import RecipeIdeas from './views/RecipeIdeas'
import CookingGuide from './views/CookingGuide'
import { generateRecipeDetails, generateRecipeIdeas } from './services/recipeService'
import type { FullRecipe, RecipeIdea } from './types/recipe'

type Screen = 'home' | 'ideas' | 'cooking'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [prompt, setPrompt] = useState('')
  const [submittedPrompt, setSubmittedPrompt] = useState('')
  const [ideas, setIdeas] = useState<RecipeIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeRecipe, setActiveRecipe] = useState<FullRecipe | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<RecipeIdea | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [recipeCache, setRecipeCache] = useState<Record<string, FullRecipe>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const totalSteps = activeRecipe?.steps.length ?? 0
  const progress = useMemo(() => {
    if (!activeRecipe || totalSteps === 0) return 0
    return ((currentStep + 1) / totalSteps) * 100
  }, [activeRecipe, currentStep, totalSteps])

  const generateIdeasForPrompt = async (basePrompt: string, previousIdeas: RecipeIdea[] = []) => {
    const cleanedPrompt = basePrompt.trim()
    if (!cleanedPrompt) return

    setLoading(true)
    setError(null)

    try {
      const nextIdeas = await generateRecipeIdeas(cleanedPrompt, previousIdeas)
      setIdeas(nextIdeas)
      setSelectedIdea(null)
      setActiveRecipe(null)
      setDetailsError(null)
      setDetailsLoading(false)
      setScreen('ideas')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe ideas.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateIdeas = async (event: FormEvent) => {
    event.preventDefault()

    const cleanedPrompt = prompt.trim()
    if (!cleanedPrompt) return

    setSubmittedPrompt(cleanedPrompt)
    await generateIdeasForPrompt(cleanedPrompt)
  }

  const getRecipeCacheKey = (basePrompt: string, recipeId: string) => `${basePrompt}::${recipeId}`

  const startCooking = async (recipe: RecipeIdea) => {
    setSelectedIdea(recipe)
    setCurrentStep(0)
    setScreen('cooking')
    setDetailsError(null)

    const cacheKey = getRecipeCacheKey(submittedPrompt, recipe.id)
    const cachedRecipe = recipeCache[cacheKey]
    if (cachedRecipe) {
      setActiveRecipe(cachedRecipe)
      setDetailsLoading(false)
      return
    }

    setActiveRecipe(null)
    setDetailsLoading(true)

    try {
      const details = await generateRecipeDetails(submittedPrompt, recipe)
      const fullRecipe: FullRecipe = { ...recipe, ...details }
      setRecipeCache((prev) => ({ ...prev, [cacheKey]: fullRecipe }))
      setActiveRecipe(fullRecipe)
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : 'Failed to load recipe details.')
    } finally {
      setDetailsLoading(false)
    }
  }

  const goBackToIdeas = () => {
    setScreen('ideas')
    setActiveRecipe(null)
    setSelectedIdea(null)
    setDetailsError(null)
    setDetailsLoading(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (!activeRecipe) return
    setCurrentStep((prev) => Math.min(prev + 1, activeRecipe.steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-4 sm:p-8">
      {screen === 'home' && (
        <Home
          prompt={prompt}
          loading={loading}
          error={error}
          onPromptChange={setPrompt}
          onSubmit={handleGenerateIdeas}
        />
      )}

      {screen === 'ideas' && (
        <RecipeIdeas
          submittedPrompt={submittedPrompt}
          ideas={ideas}
          loading={loading}
          error={error}
          onGenerateNew={() => generateIdeasForPrompt(submittedPrompt, ideas)}
          onEditPrompt={() => setScreen('home')}
          onSelectIdea={startCooking}
        />
      )}

      {screen === 'cooking' && selectedIdea && (
        <CookingGuide
          selectedIdea={selectedIdea}
          activeRecipe={activeRecipe}
          detailsLoading={detailsLoading}
          detailsError={detailsError}
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
          onBack={goBackToIdeas}
          onRetry={() => startCooking(selectedIdea)}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSelectStep={setCurrentStep}
        />
      )}
    </main>
  )
}

export default App
