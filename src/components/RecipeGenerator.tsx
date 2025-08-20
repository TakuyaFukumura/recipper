'use client';

import React, { useState } from 'react';
import { RecipeGenerationRequest, RecipeGenerationResponse } from '@/types/recipe';
import { Loader2, Sparkles } from 'lucide-react';

interface RecipeGeneratorProps {
  readonly onRecipeGenerated: (recipe: RecipeGenerationResponse) => void;
}

const OTHER_OPTION = 'その他';

export default function RecipeGenerator({ onRecipeGenerated }: Readonly<RecipeGeneratorProps>) {
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
  const [errorMessage, setErrorMessage] = useState(''); // エラー表示用
  const [selectedCuisineType, setSelectedCuisineType] = useState(''); // 選択された料理の種類
  const [customCuisineInput, setCustomCuisineInput] = useState(''); // カスタム入力用

  // 料理の種類の選択肢
  const cuisineOptions = [
    { value: '', label: '選択してください' },
    { value: '和食', label: '和食' },
    { value: 'イタリアン', label: 'イタリアン' },
    { value: '中華', label: '中華' },
    { value: 'フレンチ', label: 'フレンチ' },
    { value: 'アメリカン', label: 'アメリカン' },
    { value: 'タイ料理', label: 'タイ料理' },
    { value: 'インド料理', label: 'インド料理' },
    { value: 'メキシカン', label: 'メキシカン' },
    { value: OTHER_OPTION, label: 'その他（直接入力）' },
  ];

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

  // 料理の種類選択のハンドラー
  const handleCuisineTypeChange = (value: string) => {
    setSelectedCuisineType(value);
    if (value === OTHER_OPTION) {
      // その他が選択された場合、カスタム入力を有効にし、formDataをクリア
      setFormData(prev => ({ ...prev, cuisine: '' }));
      setCustomCuisineInput('');
    } else if (value !== '') {
      // 定義済みの選択肢が選択された場合、formDataに設定
      setFormData(prev => ({ ...prev, cuisine: value }));
      setCustomCuisineInput('');
    } else {
      // 空の選択の場合、formDataをクリア
      setFormData(prev => ({ ...prev, cuisine: '' }));
      setCustomCuisineInput('');
    }
  };

  // カスタム料理種類入力のハンドラー
  const handleCustomCuisineChange = (value: string) => {
    setCustomCuisineInput(value);
    setFormData(prev => ({ ...prev, cuisine: value }));
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
    setErrorMessage(''); // 送信時にエラーをクリア
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
      setErrorMessage('レシピの生成に失敗しました。もう一度お試しください。'); // 画面内表示
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">レシピ生成</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* エラー表示 */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {errorMessage}
          </div>
        )}
        {/* 材料入力 */}
        <div>
          <label htmlFor="ingredient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            使いたい材料
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="ingredient"
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddIngredient();
                }
              }}
              placeholder="例: 鶏肉, 玉ねぎ"
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 border p-2 text-black dark:text-white dark:bg-gray-700"
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
                key={ingredient}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 料理の種類 */}
        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            料理の種類
          </label>
          <select
            id="cuisine"
            value={selectedCuisineType}
            onChange={(e) => handleCuisineTypeChange(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 border p-2 text-black dark:text-white dark:bg-gray-700 mb-2"
          >
            {cuisineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {selectedCuisineType === OTHER_OPTION && (
            <input
              type="text"
              value={customCuisineInput}
              onChange={(e) => handleCustomCuisineChange(e.target.value)}
              placeholder="料理の種類を入力してください"
              className="w-full rounded-md border-gray-300 dark:border-gray-600 border p-2 text-black dark:text-white dark:bg-gray-700"
            />
          )}
        </div>

        {/* 難易度 */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            難易度
          </label>
          <select
            id="difficulty"
            value={formData.difficulty || 'medium'}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 border p-2 text-black dark:text-white dark:bg-gray-700"
          >
            <option value="easy">簡単</option>
            <option value="medium">普通</option>
            <option value="hard">難しい</option>
          </select>
        </div>

        {/* 調理時間 */}
        <div>
          <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            調理時間（分）
          </label>
          <input
            id="cookingTime"
            type="number"
            value={formData.cookingTime || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 30 }))}
            min="5"
            max="300"
            className="w-full rounded-md border-gray-300 dark:border-gray-600 border p-2 text-black dark:text-white dark:bg-gray-700"
          />
        </div>

        {/* 食事制限 */}
        <div>
          <label htmlFor="dietary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            食事制限・こだわり
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="dietary"
              type="text"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDietary();
                }
              }}
              placeholder="例: ベジタリアン, グルテンフリー"
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 border p-2 text-black dark:text-white dark:bg-gray-700"
            />
            <button
              type="button"
              onClick={handleAddDietary}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              追加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.dietary?.map((dietary) => (
              <span
                key={dietary}
                className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center"
              >
                {dietary}
                <button
                  type="button"
                  onClick={() => {
                    const index = formData.dietary?.indexOf(dietary) ?? -1;
                    if (index !== -1) removeDietary(index);
                  }}
                  className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
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
