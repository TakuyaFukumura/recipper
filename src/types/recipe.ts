export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[]; // Array of ingredient strings
  instructions: string[]; // Array of instruction steps
  cookingTime?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: 'main' | 'side' | 'dessert' | 'appetizer' | 'beverage';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: 'main' | 'side' | 'dessert' | 'appetizer' | 'beverage';
  tags?: string[];
}

export interface RecipeGenerationRequest {
  ingredients?: string[];
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  cookingTime?: number;
  dietary?: string[]; // vegetarian, vegan, gluten-free, etc.
}

export interface RecipeGenerationResponse {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'main' | 'side' | 'dessert' | 'appetizer' | 'beverage';
  tags: string[];
}
