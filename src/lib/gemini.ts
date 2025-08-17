import {GoogleGenerativeAI} from '@google/generative-ai';
import {RecipeGenerationRequest, RecipeGenerationResponse} from '@/types/recipe';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please provide a valid API key.');
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateRecipe(
    request: RecipeGenerationRequest
): Promise<RecipeGenerationResponse> {
    const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

    // Build the prompt based on the request
    let prompt = '以下の構造で詳細なレシピをJSON形式で日本語で生成してください：\n';
    prompt += `{
  "title": "レシピ名",
  "description": "簡単な説明",
  "ingredients": ["材料1", "材料2", ...],
  "instructions": ["手順1", "手順2", ...],
  "cookingTime": 数値（分単位）, 
  "difficulty": "easy" | "medium" | "hard",
  "category": "main" | "side" | "dessert" | "appetizer" | "beverage",
  "tags": ["タグ1", "タグ2", ...]
}\n\n`;

    prompt += 'レシピの要件：\n';
    prompt += '必ず日本語で回答してください。\n';

    if (request.ingredients && request.ingredients.length > 0) {
        prompt += `- 以下の材料を必ず含めてください: ${request.ingredients.join(', ')}\n`;
    }

    if (request.cuisine) {
        prompt += `- 料理のスタイル: ${request.cuisine}\n`;
    }

    if (request.difficulty) {
        prompt += `- 難易度: ${request.difficulty}\n`;
    }

    if (request.cookingTime) {
        prompt += `- 調理時間は約${request.cookingTime}分にしてください\n`;
    }

    if (request.dietary && request.dietary.length > 0) {
        prompt += `- 食事制限: ${request.dietary.join(', ')}\n`;
    }

    prompt += '\n追加のテキストやマークダウン形式なしで、JSONレスポンスのみを提供してください。';

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
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
