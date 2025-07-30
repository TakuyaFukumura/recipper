from django.contrib import admin
from .models import Recipe


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'cooking_time', 'servings', 'is_ai_generated', 'created_at']
    list_filter = ['difficulty', 'is_ai_generated', 'created_at']
    search_fields = ['title', 'ingredients']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 20
    
    fieldsets = (
        ('基本情報', {
            'fields': ('title', 'difficulty', 'cooking_time', 'servings', 'is_ai_generated')
        }),
        ('レシピ内容', {
            'fields': ('ingredients', 'instructions')
        }),
        ('メタ情報', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
