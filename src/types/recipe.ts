export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const

export type Difficulty = (typeof DIFFICULTY_LEVELS)[number]

export type RecipeIdea = {
  id: string
  title: string
  description: string
  prepTime: string
  cookTime: string
  difficulty: Difficulty
}

export type RecipeDetails = {
  servings: string
  ingredients: string[]
  steps: string[]
}

export type FullRecipe = RecipeIdea & RecipeDetails
