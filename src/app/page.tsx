'use client';

import { useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import RecipeGenerator from '@/components/RecipeGenerator';
import RecipeDetail from '@/components/RecipeDetail';
import { Recipe, RecipeGenerationResponse } from '@/types/recipe';
import { ChefHat, Plus, List } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'generate' | 'detail'>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | RecipeGenerationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 成功メッセージ用
  // 削除確認モーダル用state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeGenerated = (recipe: RecipeGenerationResponse) => {
    setSelectedRecipe(recipe);
    setCurrentView('detail');
  };

  const handleSaveRecipe = async (recipe: RecipeGenerationResponse) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        const savedRecipe = await response.json();
        setRecipes(prev => [savedRecipe, ...prev]);
        setCurrentView('list');
        setSelectedRecipe(null);
        setSuccessMessage('レシピが保存されました！');
      } else {
        throw new Error('Failed to save recipe');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('レシピの保存に失敗しました。');
    }
  };

  // 削除確認モーダル表示関数
  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRecipes(prev => prev.filter(recipe => recipe.id !== id));
        setSuccessMessage('レシピが削除されました。');
      } else {
        throw new Error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('レシピの削除に失敗しました。');
    } finally {
      closeDeleteModal();
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentView('detail');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* インライン通知表示 */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transition-all">
          {successMessage}
        </div>
      )}
      {/* 削除確認モーダル */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 w-full max-w-sm animate-fade-in">
            <h3 className="text-xl font-extrabold mb-4 text-red-600 text-center drop-shadow">レシピ削除の確認</h3>
            <p className="mb-6 text-gray-700 text-center text-base">このレシピを削除しますか？<br /><span className='text-xs text-gray-400'>(この操作は元に戻せません)</span></p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-300 text-gray-700 font-semibold shadow"
                onClick={closeDeleteModal}
              >キャンセル</button>
              <button
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow"
                onClick={() => deleteTargetId && handleDeleteRecipe(deleteTargetId)}
              >削除</button>
            </div>
          </div>
          <style jsx>{`
            .animate-fade-in {
              animation: fadeInModal 0.25s ease;
            }
            @keyframes fadeInModal {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-orange-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Recipper</h1>
              <span className="ml-2 text-sm text-gray-500">料理レシピ提案アプリ</span>
            </div>
            
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentView === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                レシピ一覧
              </button>
              <button
                onClick={() => setCurrentView('generate')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentView === 'generate' 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                レシピ生成
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">保存されたレシピ</h2>
              <p className="text-gray-600">{recipes.length} 件のレシピ</p>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  まだレシピがありません
                </h3>
                <p className="text-gray-600 mb-4">
                  AIを使って新しいレシピを生成してみましょう！
                </p>
                <button
                  onClick={() => setCurrentView('generate')}
                  className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  レシピを生成
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={handleEditRecipe}
                    onDelete={openDeleteModal} // ここを変更
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'generate' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AIレシピ生成</h2>
              <p className="text-gray-600">
                材料や好みを入力して、AIが最適なレシピを提案します。
              </p>
            </div>
            <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
          </div>
        )}

        {currentView === 'detail' && selectedRecipe && (
          <div>
            <RecipeDetail
              recipe={selectedRecipe}
              onSave={'id' in selectedRecipe ? undefined : handleSaveRecipe}
              onClose={() => {
                setCurrentView('list');
                setSelectedRecipe(null);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
