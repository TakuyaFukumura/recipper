import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateRecipeRequest } from '@/types/recipe';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Parse JSON strings back to arrays
    const parsedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      instructions: JSON.parse(recipe.instructions),
      tags: recipe.tags ? JSON.parse(recipe.tags) : [],
    };

    return NextResponse.json(parsedRecipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    const body: CreateRecipeRequest = await request.json();

    const recipe = await prisma.recipe.update({
      where: {
        id: params.id,
      },
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

    return NextResponse.json(parsedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  try {
    await prisma.recipe.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
