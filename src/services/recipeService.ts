import { generateGeminiJson } from './geminiClient'
import type { RecipeDetails, RecipeIdea } from '../types/recipe'

export async function generateRecipeIdeas(prompt: string, previousIdeas: RecipeIdea[] = []): Promise<RecipeIdea[]> {
  const previousIdeasBlock =
    previousIdeas.length > 0
      ? `Previously generated ideas to avoid repeating:
${JSON.stringify(previousIdeas, null, 2)}

`
      : ''

  const text = await generateGeminiJson(`Generate four distinct recipe ideas based on this request: "${prompt}".
${previousIdeasBlock}Return only strict JSON in this exact format:
[
  {
    "id": "short-kebab-case-id",
    "title": "Recipe title",
    "description": "1-2 sentence summary",
    "prepTime": "e.g. 15 min",
    "cookTime": "e.g. 30 min",
    "difficulty": "Easy/Medium/Hard"
  }
]
Requirements:
- Exactly 4 recipes
- Practical for home cooking
- If previously generated ideas are provided, produce clearly different recipes with different primary proteins/vegetables/flavor profiles/cuisines and avoid repeating titles or close variants`)

  const parsed = JSON.parse(text) as RecipeIdea[]

  if (!Array.isArray(parsed) || parsed.length !== 4) {
    throw new Error('Unexpected recipe response format.')
  }

  return parsed
}

export async function generateRecipeDetails(
  originalPrompt: string,
  selectedRecipe: RecipeIdea,
): Promise<RecipeDetails> {
  const text = await generateGeminiJson(`You are expanding one selected recipe idea into a full home-cooking recipe.
Original user request: "${originalPrompt}"
Selected recipe idea:
${JSON.stringify(selectedRecipe, null, 2)}

Return only strict JSON in this exact format:
{
  "servings": "e.g. 4",
  "ingredients": ["..."],
  "steps": ["...", "...", "...", "..."]
}
Requirements:
- At least 4 steps
- Ingredients and steps must match the selected idea
- Keep the recipe practical for home cooking`)

  const parsed = JSON.parse(text) as RecipeDetails

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    typeof parsed.servings !== 'string' ||
    !Array.isArray(parsed.ingredients) ||
    !Array.isArray(parsed.steps) ||
    parsed.steps.length < 4
  ) {
    throw new Error('Unexpected recipe detail response format.')
  }

  return parsed
}
