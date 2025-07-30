import { NextRequest, NextResponse } from 'next/server';
import { prisma, PrismaRecipe } from '@/lib/prisma';
import { CreateRecipeRequest } from '@/types/recipe';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse JSON strings back to arrays
    const parsedRecipes = recipes.map((recipe: PrismaRecipe) => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    }));

    return NextResponse.json(parsedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRecipeRequest = await request.json();

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title,
        description: body.description,
        ingredients: JSON.stringify(body.ingredients),
        instructions: JSON.stringify(body.instructions),
        cookingTime: body.cookingTime,
        difficulty: body.difficulty,
        category: body.category,
        tags: body.tags ? JSON.stringify(body.tags) : null,
      },
    });

    // Parse JSON strings back to arrays for response
    const parsedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    };

    return NextResponse.json(parsedRecipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}