import { Recipe } from '@/types/recipe';
import { Clock, User, Tag } from 'lucide-react';

interface RecipeCardProps {
  readonly recipe: Recipe;
  readonly onShowDetail?: (recipe: Recipe) => void;
  readonly onDelete?: (id: string) => void;
}

export default function RecipeCard({ recipe, onShowDetail, onDelete }: Readonly<RecipeCardProps>) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
  };

  const categoryColors = {
    main: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    side: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    dessert: 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200',
    appetizer: 'bg-orange-100 text-orange-800 dark:text-orange-200',
    beverage: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <button
          type="button"
          className={
            [
              "text-xl font-semibold text-gray-900 dark:text-white cursor-pointer",
              "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
              "bg-transparent border-none p-0 m-0 text-left"
            ].join(" ")
          }
          onClick={onShowDetail ? () => onShowDetail(recipe) : undefined}
        >
          {recipe.title}
        </button>
        <div className="flex gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(recipe.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
            >
              削除
            </button>
          )}
        </div>
      </div>

      {recipe.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">{recipe.description}</p>
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
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <Clock className="inline w-3 h-3 mr-1" />
            {recipe.cookingTime}分
          </span>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">材料:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
            <li key={`${ingredient}-${idx}`} className="flex items-center">
              <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></span>
              {ingredient}
            </li>
          ))}
          {recipe.ingredients.length > 3 && (
            <li className="text-gray-400 dark:text-gray-500">...他 {recipe.ingredients.length - 3} 個</li>
          )}
        </ul>
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
