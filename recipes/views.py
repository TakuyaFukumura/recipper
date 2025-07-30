from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db.models import Q
import json
import logging

from .models import Recipe
from .gemini_service import GeminiService

logger = logging.getLogger(__name__)


def index(request):
    """ホームページ"""
    recent_recipes = Recipe.objects.all()[:6]  # 最新の6件を表示
    return render(request, 'recipes/index.html', {
        'recent_recipes': recent_recipes
    })


def recipe_list(request):
    """レシピ一覧ページ"""
    search_query = request.GET.get('search', '')
    difficulty_filter = request.GET.get('difficulty', '')
    
    recipes = Recipe.objects.all()
    
    # 検索機能
    if search_query:
        recipes = recipes.filter(
            Q(title__icontains=search_query) |
            Q(ingredients__icontains=search_query)
        )
    
    # 難易度フィルター
    if difficulty_filter:
        recipes = recipes.filter(difficulty=difficulty_filter)
    
    # ページネーション
    paginator = Paginator(recipes, 12)  # 1ページに12件表示
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'recipes/recipe_list.html', {
        'page_obj': page_obj,
        'search_query': search_query,
        'difficulty_filter': difficulty_filter,
        'difficulty_choices': Recipe._meta.get_field('difficulty').choices,
    })


def recipe_detail(request, pk):
    """レシピ詳細ページ"""
    recipe = get_object_or_404(Recipe, pk=pk)
    return render(request, 'recipes/recipe_detail.html', {
        'recipe': recipe
    })


def recipe_create(request):
    """レシピ作成ページ"""
    if request.method == 'POST':
        try:
            title = request.POST.get('title')
            ingredients = request.POST.get('ingredients')
            instructions = request.POST.get('instructions')
            cooking_time = request.POST.get('cooking_time')
            servings = request.POST.get('servings')
            difficulty = request.POST.get('difficulty')
            
            # バリデーション
            if not all([title, ingredients, instructions]):
                messages.error(request, 'レシピ名、材料、作り方は必須項目です。')
                return render(request, 'recipes/recipe_create.html')
            
            # レシピ作成
            recipe = Recipe.objects.create(
                title=title,
                ingredients=ingredients,
                instructions=instructions,
                cooking_time=int(cooking_time) if cooking_time else None,
                servings=int(servings) if servings else None,
                difficulty=difficulty,
                is_ai_generated=False
            )
            
            messages.success(request, 'レシピが正常に作成されました。')
            return redirect('recipe_detail', pk=recipe.pk)
            
        except Exception as e:
            logger.error(f"レシピ作成中にエラーが発生しました: {str(e)}")
            messages.error(request, 'レシピの作成中にエラーが発生しました。')
    
    return render(request, 'recipes/recipe_create.html', {
        'difficulty_choices': Recipe._meta.get_field('difficulty').choices,
    })


def ai_recipe_generate(request):
    """AI レシピ生成ページ"""
    if request.method == 'POST':
        try:
            ingredients = request.POST.get('ingredients')
            cuisine_type = request.POST.get('cuisine_type')
            difficulty = request.POST.get('difficulty')
            cooking_time = request.POST.get('cooking_time')
            
            # Gemini APIでレシピ生成
            gemini_service = GeminiService()
            recipe_data = gemini_service.generate_recipe(
                ingredients=ingredients,
                cuisine_type=cuisine_type,
                difficulty=difficulty,
                cooking_time=int(cooking_time) if cooking_time else None
            )
            
            # 生成されたレシピをデータベースに保存
            recipe = Recipe.objects.create(
                title=recipe_data['title'],
                ingredients=recipe_data['ingredients'],
                instructions=recipe_data['instructions'],
                cooking_time=recipe_data['cooking_time'],
                servings=2,  # デフォルト2人分
                difficulty=recipe_data['difficulty'],
                is_ai_generated=True
            )
            
            messages.success(request, 'AIがレシピを生成しました！')
            return redirect('recipe_detail', pk=recipe.pk)
            
        except ValueError as e:
            messages.error(request, f'設定エラー: {str(e)}')
        except Exception as e:
            logger.error(f"AIレシピ生成中にエラーが発生しました: {str(e)}")
            messages.error(request, 'レシピの生成中にエラーが発生しました。もう一度お試しください。')
    
    return render(request, 'recipes/ai_recipe_generate.html', {
        'difficulty_choices': Recipe._meta.get_field('difficulty').choices,
    })


def recipe_edit(request, pk):
    """レシピ編集ページ"""
    recipe = get_object_or_404(Recipe, pk=pk)
    
    if request.method == 'POST':
        try:
            recipe.title = request.POST.get('title')
            recipe.ingredients = request.POST.get('ingredients')
            recipe.instructions = request.POST.get('instructions')
            cooking_time = request.POST.get('cooking_time')
            servings = request.POST.get('servings')
            recipe.difficulty = request.POST.get('difficulty')
            
            # バリデーション
            if not all([recipe.title, recipe.ingredients, recipe.instructions]):
                messages.error(request, 'レシピ名、材料、作り方は必須項目です。')
                return render(request, 'recipes/recipe_edit.html', {'recipe': recipe})
            
            recipe.cooking_time = int(cooking_time) if cooking_time else None
            recipe.servings = int(servings) if servings else None
            recipe.save()
            
            messages.success(request, 'レシピが正常に更新されました。')
            return redirect('recipe_detail', pk=recipe.pk)
            
        except Exception as e:
            logger.error(f"レシピ編集中にエラーが発生しました: {str(e)}")
            messages.error(request, 'レシピの更新中にエラーが発生しました。')
    
    return render(request, 'recipes/recipe_edit.html', {
        'recipe': recipe,
        'difficulty_choices': Recipe._meta.get_field('difficulty').choices,
    })


def recipe_delete(request, pk):
    """レシピ削除"""
    recipe = get_object_or_404(Recipe, pk=pk)
    
    if request.method == 'POST':
        try:
            recipe.delete()
            messages.success(request, 'レシピが削除されました。')
            return redirect('recipe_list')
        except Exception as e:
            logger.error(f"レシピ削除中にエラーが発生しました: {str(e)}")
            messages.error(request, 'レシピの削除中にエラーが発生しました。')
    
    return render(request, 'recipes/recipe_delete.html', {'recipe': recipe})


# API エンドポイント
@csrf_exempt
@require_http_methods(["GET"])
def api_recipe_list(request):
    """レシピ一覧API"""
    try:
        recipes = Recipe.objects.all()
        search_query = request.GET.get('search')
        
        if search_query:
            recipes = recipes.filter(
                Q(title__icontains=search_query) |
                Q(ingredients__icontains=search_query)
            )
        
        recipe_list = []
        for recipe in recipes:
            recipe_list.append({
                'id': recipe.id,
                'title': recipe.title,
                'ingredients': recipe.ingredients,
                'instructions': recipe.instructions,
                'cooking_time': recipe.cooking_time,
                'servings': recipe.servings,
                'difficulty': recipe.get_difficulty_display(),
                'is_ai_generated': recipe.is_ai_generated,
                'created_at': recipe.created_at.isoformat(),
            })
        
        return JsonResponse({
            'status': 'success',
            'data': recipe_list
        })
        
    except Exception as e:
        logger.error(f"API レシピ一覧取得中にエラーが発生しました: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': 'データの取得中にエラーが発生しました'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def api_recipe_detail(request, pk):
    """レシピ詳細API"""
    try:
        recipe = get_object_or_404(Recipe, pk=pk)
        
        recipe_data = {
            'id': recipe.id,
            'title': recipe.title,
            'ingredients': recipe.ingredients,
            'instructions': recipe.instructions,
            'cooking_time': recipe.cooking_time,
            'servings': recipe.servings,
            'difficulty': recipe.get_difficulty_display(),
            'is_ai_generated': recipe.is_ai_generated,
            'created_at': recipe.created_at.isoformat(),
            'updated_at': recipe.updated_at.isoformat(),
        }
        
        return JsonResponse({
            'status': 'success',
            'data': recipe_data
        })
        
    except Recipe.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'レシピが見つかりません'
        }, status=404)
    except Exception as e:
        logger.error(f"API レシピ詳細取得中にエラーが発生しました: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': 'データの取得中にエラーが発生しました'
        }, status=500)
