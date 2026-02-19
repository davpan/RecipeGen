import { generateGeminiJson } from './geminiClient'
import { DIFFICULTY_LEVELS, type RecipeDetails, type RecipeIdea } from '../types/recipe'

function parseJsonResponse<T>(text: string, errorMessage: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(errorMessage)
  }
}

async function generateAndParse<T>(prompt: string, errorMessage: string): Promise<T> {
  const text = await generateGeminiJson(prompt)
  return parseJsonResponse<T>(text, errorMessage)
}

function isValidDifficulty(value: string): value is RecipeIdea['difficulty'] {
  return (DIFFICULTY_LEVELS as readonly string[]).includes(value)
}

function assertRecipeIdeas(parsed: RecipeIdea[]): asserts parsed is RecipeIdea[] {
  if (!Array.isArray(parsed) || parsed.length !== 4) {
    throw new Error('Unexpected recipe response format.')
  }

  for (const recipe of parsed) {
    if (
      !recipe ||
      typeof recipe !== 'object' ||
      typeof recipe.id !== 'string' ||
      typeof recipe.title !== 'string' ||
      typeof recipe.description !== 'string' ||
      typeof recipe.prepTime !== 'string' ||
      typeof recipe.cookTime !== 'string' ||
      typeof recipe.difficulty !== 'string' ||
      !isValidDifficulty(recipe.difficulty)
    ) {
      throw new Error('Unexpected recipe response format.')
    }
  }
}

function assertRecipeDetails(parsed: RecipeDetails): asserts parsed is RecipeDetails {
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
}

export async function generateRecipeIdeas(prompt: string, previousIdeas: RecipeIdea[] = []): Promise<RecipeIdea[]> {
  const previousIdeasBlock =
    previousIdeas.length > 0
      ? `Previously generated ideas to avoid repeating:\n${JSON.stringify(previousIdeas, null, 2)}\n\n`
      : ''

  const parsed = await generateAndParse<RecipeIdea[]>(
    `Generate four distinct recipe ideas based on this request: "${prompt}".
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
- If previously generated ideas are provided, produce clearly different recipes with different primary proteins/vegetables/flavor profiles/cuisines and avoid repeating titles or close variants`,
    'Failed to parse recipe ideas as JSON.',
  )

  assertRecipeIdeas(parsed)
  return parsed
}

export async function generateRecipeDetails(
  originalPrompt: string,
  selectedRecipe: RecipeIdea,
): Promise<RecipeDetails> {
  const parsed = await generateAndParse<RecipeDetails>(
    `You are expanding one selected recipe idea into a full home-cooking recipe.
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
- Keep the recipe practical for home cooking`,
    'Failed to parse recipe details as JSON.',
  )

  assertRecipeDetails(parsed)
  return parsed
}
