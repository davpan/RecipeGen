import Home from './views/Home'
import RecipeList from './views/RecipeList'
import RecipeDetail from './views/RecipeDetail'
import { useRecipeFlow } from './hooks/useRecipeFlow'

function App() {
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
    },
    actions,
  } = useRecipeFlow()

  return (
    <main className="mx-auto min-h-dvh w-full bg-parchment-100">
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
        <RecipeList
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
        <RecipeDetail
          selectedIdea={selectedIdea}
          activeRecipe={activeRecipe}
          detailsLoading={detailsLoading}
          detailsError={detailsError}
          onBack={actions.goBackToIdeas}
          onRetry={() => actions.startCooking(selectedIdea)}
        />
      )}
    </main>
  )
}

export default App
