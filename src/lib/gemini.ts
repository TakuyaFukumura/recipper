import { GoogleGenerativeAI } from '@google/generative-ai';
import { RecipeGenerationRequest, RecipeGenerationResponse } from '@/types/recipe';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateRecipe(
  request: RecipeGenerationRequest
): Promise<RecipeGenerationResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Build the prompt based on the request
  let prompt = 'Please generate a detailed recipe in JSON format with the following structure:\n';
  prompt += `{
    "title": "Recipe name",
    "description": "Brief description",
    "ingredients": ["ingredient 1", "ingredient 2", ...],
    "instructions": ["step 1", "step 2", ...],
    "cookingTime": number (in minutes),
    "difficulty": "easy" | "medium" | "hard",
    "category": "main" | "side" | "dessert" | "appetizer" | "beverage",
    "tags": ["tag1", "tag2", ...]
  }\n\n`;

  prompt += 'Recipe requirements:\n';

  if (request.ingredients && request.ingredients.length > 0) {
    prompt += `- Must include these ingredients: ${request.ingredients.join(', ')}\n`;
  }

  if (request.cuisine) {
    prompt += `- Cuisine style: ${request.cuisine}\n`;
  }

  if (request.difficulty) {
    prompt += `- Difficulty level: ${request.difficulty}\n`;
  }

  if (request.cookingTime) {
    prompt += `- Cooking time should be around ${request.cookingTime} minutes\n`;
  }

  if (request.dietary && request.dietary.length > 0) {
    prompt += `- Dietary restrictions: ${request.dietary.join(', ')}\n`;
  }

  prompt += '\nPlease provide only the JSON response without any additional text or markdown formatting.';

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response and parse JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const recipeData = JSON.parse(cleanedText);

    return {
      title: recipeData.title || 'Generated Recipe',
      description: recipeData.description || '',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      cookingTime: recipeData.cookingTime || 30,
      difficulty: recipeData.difficulty || 'medium',
      category: recipeData.category || 'main',
      tags: recipeData.tags || [],
    };
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe');
  }
}
