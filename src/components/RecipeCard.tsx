import { Recipe } from '@/types/recipe';
import { Clock, User, Tag } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
}

export default function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const categoryColors = {
    main: 'bg-blue-100 text-blue-800',
    side: 'bg-purple-100 text-purple-800',
    dessert: 'bg-pink-100 text-pink-800',
    appetizer: 'bg-orange-100 text-orange-800',
    beverage: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(recipe)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              編集
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(recipe.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              削除
            </button>
          )}
        </div>
      </div>

      {recipe.description && (
        <p className="text-gray-600 mb-4">{recipe.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.difficulty && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
            <User className="inline w-3 h-3 mr-1" />
            {recipe.difficulty}
          </span>
        )}
        
        {recipe.category && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[recipe.category]}`}>
            <Tag className="inline w-3 h-3 mr-1" />
            {recipe.category}
          </span>
        )}
        
        {recipe.cookingTime && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="inline w-3 h-3 mr-1" />
            {recipe.cookingTime}分
          </span>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">材料:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
              {ingredient}
            </li>
          ))}
          {recipe.ingredients.length > 3 && (
            <li className="text-gray-400">...他 {recipe.ingredients.length - 3} 個</li>
          )}
        </ul>
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}