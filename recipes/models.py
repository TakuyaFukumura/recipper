from django.db import models
from django.utils import timezone


class Recipe(models.Model):
    """レシピモデル"""
    title = models.CharField(max_length=200, verbose_name='レシピ名')
    ingredients = models.TextField(verbose_name='材料')
    instructions = models.TextField(verbose_name='作り方')
    cooking_time = models.IntegerField(null=True, blank=True, verbose_name='調理時間（分）')
    servings = models.IntegerField(null=True, blank=True, verbose_name='何人分')
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', '簡単'),
            ('medium', '普通'),
            ('hard', '難しい'),
        ],
        default='medium',
        verbose_name='難易度'
    )
    created_at = models.DateTimeField(default=timezone.now, verbose_name='作成日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    is_ai_generated = models.BooleanField(default=False, verbose_name='AI生成レシピ')

    class Meta:
        verbose_name = 'レシピ'
        verbose_name_plural = 'レシピ'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
