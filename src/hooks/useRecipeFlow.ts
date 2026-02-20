import { FormEvent, useMemo, useReducer } from 'react'
import { generateRecipeDetails, generateRecipeIdeas } from '../services/recipeService'
import type { FullRecipe, RecipeIdea } from '../types/recipe'

type Screen = 'home' | 'ideas' | 'cooking'

type State = {
  screen: Screen
  prompt: string
  submittedPrompt: string
  ideas: RecipeIdea[]
  loading: boolean
  error: string | null
  activeRecipe: FullRecipe | null
  selectedIdea: RecipeIdea | null
  detailsLoading: boolean
  detailsError: string | null
  recipeCache: Record<string, FullRecipe>
  currentStep: number
}

type Action =
  | { type: 'setPrompt'; payload: string }
  | { type: 'generateIdeasStart'; payload: { prompt: string; keepCurrentIdeas: boolean } }
  | { type: 'generateIdeasSuccess'; payload: { prompt: string; ideas: RecipeIdea[] } }
  | { type: 'generateIdeasFailure'; payload: string }
  | { type: 'startCookingInit'; payload: RecipeIdea }
  | { type: 'useCachedRecipe'; payload: FullRecipe }
  | { type: 'loadRecipeStart' }
  | { type: 'loadRecipeSuccess'; payload: { key: string; recipe: FullRecipe } }
  | { type: 'loadRecipeFailure'; payload: string }
  | { type: 'goBackToIdeas' }
  | { type: 'editPrompt' }
  | { type: 'nextStep' }
  | { type: 'prevStep' }
  | { type: 'selectStep'; payload: number }

const initialState: State = {
  screen: 'home',
  prompt: '',
  submittedPrompt: '',
  ideas: [],
  loading: false,
  error: null,
  activeRecipe: null,
  selectedIdea: null,
  detailsLoading: false,
  detailsError: null,
  recipeCache: {},
  currentStep: 0,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setPrompt':
      return { ...state, prompt: action.payload }
    case 'generateIdeasStart':
      return {
        ...state,
        loading: true,
        error: null,
        screen: 'ideas',
        submittedPrompt: action.payload.prompt,
        ideas: action.payload.keepCurrentIdeas ? state.ideas : [],
      }
    case 'generateIdeasSuccess':
      return {
        ...state,
        loading: false,
        error: null,
        submittedPrompt: action.payload.prompt,
        ideas: action.payload.ideas,
        selectedIdea: null,
        activeRecipe: null,
        detailsError: null,
        detailsLoading: false,
        screen: 'ideas',
      }
    case 'generateIdeasFailure':
      return { ...state, loading: false, error: action.payload }
    case 'startCookingInit':
      return {
        ...state,
        selectedIdea: action.payload,
        currentStep: 0,
        screen: 'cooking',
        detailsError: null,
      }
    case 'useCachedRecipe':
      return { ...state, activeRecipe: action.payload, detailsLoading: false }
    case 'loadRecipeStart':
      return { ...state, activeRecipe: null, detailsLoading: true }
    case 'loadRecipeSuccess':
      return {
        ...state,
        detailsLoading: false,
        activeRecipe: action.payload.recipe,
        recipeCache: { ...state.recipeCache, [action.payload.key]: action.payload.recipe },
      }
    case 'loadRecipeFailure':
      return { ...state, detailsLoading: false, detailsError: action.payload }
    case 'goBackToIdeas':
      return {
        ...state,
        screen: 'ideas',
        activeRecipe: null,
        selectedIdea: null,
        detailsError: null,
        detailsLoading: false,
        currentStep: 0,
      }
    case 'editPrompt':
      return {
        ...state,
        screen: 'home',
        prompt: state.submittedPrompt,
      }
    case 'nextStep':
      if (!state.activeRecipe) return state
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.activeRecipe.steps.length - 1),
      }
    case 'prevStep':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
    case 'selectStep':
      return { ...state, currentStep: action.payload }
    default:
      return state
  }
}

function getRecipeCacheKey(basePrompt: string, recipeId: string) {
  return `${basePrompt}::${recipeId}`
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function useRecipeFlow() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const totalSteps = state.activeRecipe?.steps.length ?? 0
  const progress = useMemo(() => {
    if (!state.activeRecipe || totalSteps === 0) return 0
    return ((state.currentStep + 1) / totalSteps) * 100
  }, [state.activeRecipe, state.currentStep, totalSteps])

  const generateIdeasForPrompt = async (basePrompt: string, previousIdeas: RecipeIdea[] = []) => {
    const cleanedPrompt = basePrompt.trim()
    if (!cleanedPrompt) return

    dispatch({
      type: 'generateIdeasStart',
      payload: { prompt: cleanedPrompt, keepCurrentIdeas: previousIdeas.length > 0 },
    })

    try {
      const ideas = await generateRecipeIdeas(cleanedPrompt, previousIdeas)
      dispatch({ type: 'generateIdeasSuccess', payload: { prompt: cleanedPrompt, ideas } })
    } catch (error) {
      dispatch({
        type: 'generateIdeasFailure',
        payload: toErrorMessage(error, 'Failed to generate recipe ideas.'),
      })
    }
  }

  const handleGenerateIdeas = async (event: FormEvent) => {
    event.preventDefault()
    await generateIdeasForPrompt(state.prompt)
  }

  const startCooking = async (recipe: RecipeIdea) => {
    dispatch({ type: 'startCookingInit', payload: recipe })

    const cacheKey = getRecipeCacheKey(state.submittedPrompt, recipe.id)
    const cachedRecipe = state.recipeCache[cacheKey]
    if (cachedRecipe) {
      dispatch({ type: 'useCachedRecipe', payload: cachedRecipe })
      return
    }

    dispatch({ type: 'loadRecipeStart' })

    try {
      const details = await generateRecipeDetails(state.submittedPrompt, recipe)
      const fullRecipe: FullRecipe = { ...recipe, ...details }
      dispatch({ type: 'loadRecipeSuccess', payload: { key: cacheKey, recipe: fullRecipe } })
    } catch (error) {
      dispatch({
        type: 'loadRecipeFailure',
        payload: toErrorMessage(error, 'Failed to load recipe details.'),
      })
    }
  }

  return {
    state,
    progress,
    totalSteps,
    actions: {
      setPrompt: (nextPrompt: string) => dispatch({ type: 'setPrompt', payload: nextPrompt }),
      handleGenerateIdeas,
      generateIdeasForPrompt,
      startCooking,
      goBackToIdeas: () => dispatch({ type: 'goBackToIdeas' }),
      editPrompt: () => dispatch({ type: 'editPrompt' }),
      nextStep: () => dispatch({ type: 'nextStep' }),
      prevStep: () => dispatch({ type: 'prevStep' }),
      selectStep: (stepIndex: number) => dispatch({ type: 'selectStep', payload: stepIndex }),
    },
  }
}
