import { NextRequest, NextResponse } from 'next/server';
import { generateRecipe } from '@/lib/gemini';
import { RecipeGenerationRequest } from '@/types/recipe';

export async function POST(request: NextRequest) {
  try {
    const body: RecipeGenerationRequest = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const recipe = await generateRecipe(body);
    
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}
