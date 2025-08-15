import { Recipe, RecipeGenerationResponse } from '@/types/recipe';
import { Clock, User, Tag, ChefHat } from 'lucide-react';

type RecipeDetailProps = Readonly<{
  recipe: Recipe | RecipeGenerationResponse;
  onSave?: (recipe: RecipeGenerationResponse) => void;
  onClose?: () => void;
}>;

export default function RecipeDetail({ recipe, onSave, onClose }: RecipeDetailProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
  };

  const categoryColors = {
    main: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    side: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    dessert: 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200',
    appetizer: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200',
    beverage: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200',
  };

  const handleSave = async () => {
    if (onSave && !('id' in recipe)) {
      await onSave(recipe as RecipeGenerationResponse);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <ChefHat className="w-8 h-8 text-orange-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.title}</h1>
        </div>
        <div className="flex gap-2">
          {onSave && !('id' in recipe) && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              閉じる
            </button>
          )}
        </div>
      </div>

      {recipe.description && (
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{recipe.description}</p>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        {recipe.difficulty && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recipe.difficulty]}`}>
            <User className="inline w-4 h-4 mr-1" />
            {recipe.difficulty === 'easy' ? '簡単' : recipe.difficulty === 'medium' ? '普通' : '難しい'}
          </span>
        )}
        
        {recipe.category && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[recipe.category]}`}>
            <Tag className="inline w-4 h-4 mr-1" />
            {recipe.category === 'main' ? 'メイン' : 
             recipe.category === 'side' ? 'サイド' :
             recipe.category === 'dessert' ? 'デザート' :
             recipe.category === 'appetizer' ? '前菜' : '飲み物'}
          </span>
        )}
        
        {recipe.cookingTime && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <Clock className="inline w-4 h-4 mr-1" />
            {recipe.cookingTime}分
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 材料 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-6 h-6 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full flex items-center justify-center text-sm font-bold mr-2">
              材
            </span>
            材料
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 手順 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-6 h-6 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 rounded-full flex items-center justify-center text-sm font-bold mr-2">
              手
            </span>
            作り方
          </h2>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction: string, index: number) => (
              <li key={index} className="flex">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">タグ</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {'createdAt' in recipe && recipe.createdAt && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            作成日: {new Date(recipe.createdAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
      )}
    </div>
  );
}
