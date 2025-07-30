'use client';

import { useState } from 'react';
import { RecipeGenerationRequest, RecipeGenerationResponse } from '@/types/recipe';
import { Loader2, Sparkles } from 'lucide-react';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: RecipeGenerationResponse) => void;
}

export default function RecipeGenerator({ onRecipeGenerated }: RecipeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<RecipeGenerationRequest>({
    ingredients: [],
    cuisine: '',
    difficulty: 'medium',
    cookingTime: 30,
    dietary: [],
  });

  const [ingredientInput, setIngredientInput] = useState('');
  const [dietaryInput, setDietaryInput] = useState('');

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredientInput.trim()]
      }));
      setIngredientInput('');
    }
  };

  const handleAddDietary = () => {
    if (dietaryInput.trim()) {
      setFormData(prev => ({
        ...prev,
        dietary: [...(prev.dietary || []), dietaryInput.trim()]
      }));
      setDietaryInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || []
    }));
  };

  const removeDietary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const recipe = await response.json();
      onRecipeGenerated(recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('レシピの生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">レシピ生成</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 材料入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            使いたい材料
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
              placeholder="例: 鶏肉, 玉ねぎ"
              className="flex-1 rounded-md border-gray-300 border p-2 text-black"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.ingredients?.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 料理の種類 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            料理の種類
          </label>
          <input
            type="text"
            value={formData.cuisine || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
            placeholder="例: 和食, イタリアン, 中華"
            className="w-full rounded-md border-gray-300 border p-2 text-black"
          />
        </div>

        {/* 難易度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            難易度
          </label>
          <select
            value={formData.difficulty || 'medium'}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
            className="w-full rounded-md border-gray-300 border p-2 text-black"
          >
            <option value="easy">簡単</option>
            <option value="medium">普通</option>
            <option value="hard">難しい</option>
          </select>
        </div>

        {/* 調理時間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            調理時間（分）
          </label>
          <input
            type="number"
            value={formData.cookingTime || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 30 }))}
            min="5"
            max="300"
            className="w-full rounded-md border-gray-300 border p-2 text-black"
          />
        </div>

        {/* 食事制限 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            食事制限・こだわり
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDietary())}
              placeholder="例: ベジタリアン, グルテンフリー"
              className="flex-1 rounded-md border-gray-300 border p-2"
            />
            <button
              type="button"
              onClick={handleAddDietary}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-black"
            >
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.dietary?.map((dietary, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
              >
                {dietary}
                <button
                  type="button"
                  onClick={() => removeDietary(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center px-4 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              レシピを生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              レシピを生成
            </>
          )}
        </button>
      </form>
    </div>
  );
}
