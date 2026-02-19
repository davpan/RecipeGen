export type RecipeIdea = {
  id: string
  title: string
  description: string
  prepTime: string
  cookTime: string
  difficulty: string
}

export type RecipeDetails = {
  servings: string
  ingredients: string[]
  steps: string[]
}

export type FullRecipe = RecipeIdea & RecipeDetails
