from django.urls import path
from . import views

urlpatterns = [
    # Web画面
    path('', views.index, name='index'),
    path('recipes/', views.recipe_list, name='recipe_list'),
    path('recipes/<int:pk>/', views.recipe_detail, name='recipe_detail'),
    path('recipes/create/', views.recipe_create, name='recipe_create'),
    path('recipes/<int:pk>/edit/', views.recipe_edit, name='recipe_edit'),
    path('recipes/<int:pk>/delete/', views.recipe_delete, name='recipe_delete'),
    path('ai-generate/', views.ai_recipe_generate, name='ai_recipe_generate'),
    
    # API エンドポイント
    path('api/recipes/', views.api_recipe_list, name='api_recipe_list'),
    path('api/recipes/<int:pk>/', views.api_recipe_detail, name='api_recipe_detail'),
]