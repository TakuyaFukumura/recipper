from django.test import TestCase, Client
from django.urls import reverse
from .models import Recipe


class RecipeModelTests(TestCase):
    """レシピモデルのテスト"""
    
    def test_recipe_creation(self):
        """レシピの作成テスト"""
        recipe = Recipe.objects.create(
            title="テストレシピ",
            ingredients="テスト材料",
            instructions="テスト手順",
            cooking_time=30,
            servings=2,
            difficulty="easy"
        )
        self.assertEqual(recipe.title, "テストレシピ")
        self.assertEqual(recipe.difficulty, "easy")
        self.assertEqual(str(recipe), "テストレシピ")


class RecipeViewTests(TestCase):
    """レシピビューのテスト"""
    
    def setUp(self):
        self.client = Client()
        self.recipe = Recipe.objects.create(
            title="テストレシピ",
            ingredients="テスト材料",
            instructions="テスト手順",
            cooking_time=30,
            servings=2
        )
    
    def test_index_view(self):
        """ホームページのテスト"""
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "レシピ提案アプリ")
    
    def test_recipe_list_view(self):
        """レシピ一覧ページのテスト"""
        response = self.client.get(reverse('recipe_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "テストレシピ")
    
    def test_recipe_detail_view(self):
        """レシピ詳細ページのテスト"""
        response = self.client.get(reverse('recipe_detail', kwargs={'pk': self.recipe.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "テストレシピ")
        self.assertContains(response, "テスト材料")
    
    def test_recipe_create_view(self):
        """レシピ作成ページのテスト"""
        response = self.client.get(reverse('recipe_create'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "新しいレシピを作成")
    
    def test_recipe_create_post(self):
        """レシピ作成POSTのテスト"""
        response = self.client.post(reverse('recipe_create'), {
            'title': '新しいレシピ',
            'ingredients': '新しい材料',
            'instructions': '新しい手順',
            'cooking_time': 45,
            'servings': 4,
            'difficulty': 'medium'
        })
        self.assertEqual(response.status_code, 302)  # リダイレクト
        self.assertTrue(Recipe.objects.filter(title='新しいレシピ').exists())
    
    def test_api_recipe_list(self):
        """レシピ一覧APIのテスト"""
        response = self.client.get(reverse('api_recipe_list'))
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content.decode(),
            {
                'status': 'success',
                'data': [
                    {
                        'id': self.recipe.id,
                        'title': 'テストレシピ',
                        'ingredients': 'テスト材料',
                        'instructions': 'テスト手順',
                        'cooking_time': 30,
                        'servings': 2,
                        'difficulty': '普通',
                        'is_ai_generated': False,
                        'created_at': self.recipe.created_at.isoformat(),
                    }
                ]
            }
        )
