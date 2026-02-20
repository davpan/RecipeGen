import { useEffect } from 'react'
import Home from './views/Home'
import RecipeIdeas from './views/RecipeIdeas'
import CookingGuide from './views/CookingGuide'
import { useRecipeFlow } from './hooks/useRecipeFlow'
import { preloadGeminiAuth } from './services/geminiClient'

function App() {
  useEffect(() => {
    preloadGeminiAuth()
  }, [])

  const {
    state: {
      screen,
      prompt,
      submittedPrompt,
      ideas,
      loading,
      error,
      selectedIdea,
      activeRecipe,
      detailsLoading,
      detailsError,
      currentStep,
    },
    totalSteps,
    progress,
    actions,
  } = useRecipeFlow()

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl p-4 sm:p-8">
      {screen === 'home' && (
        <Home
          prompt={prompt}
          loading={loading}
          error={error}
          onPromptChange={actions.setPrompt}
          onSubmit={actions.handleGenerateIdeas}
        />
      )}

      {screen === 'ideas' && (
        <RecipeIdeas
          submittedPrompt={submittedPrompt}
          ideas={ideas}
          loading={loading}
          error={error}
          onGenerateNew={() => actions.generateIdeasForPrompt(submittedPrompt, ideas)}
          onEditPrompt={actions.editPrompt}
          onSelectIdea={actions.startCooking}
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
          onBack={actions.goBackToIdeas}
          onRetry={() => actions.startCooking(selectedIdea)}
          onPrevStep={actions.prevStep}
          onNextStep={actions.nextStep}
          onSelectStep={actions.selectStep}
        />
      )}
    </main>
  )
}

export default App
