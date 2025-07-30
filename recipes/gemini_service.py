import google.generativeai as genai
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class GeminiService:
    """Gemini API連携サービス"""
    
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY環境変数が設定されていません")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def generate_recipe(self, ingredients=None, cuisine_type=None, difficulty=None, cooking_time=None):
        """
        指定された条件に基づいてレシピを生成する
        
        Args:
            ingredients (str): 使用したい材料
            cuisine_type (str): 料理の種類（和食、洋食、中華など）
            difficulty (str): 難易度（簡単、普通、難しい）
            cooking_time (int): 調理時間の目安（分）
        
        Returns:
            dict: 生成されたレシピ情報
        """
        try:
            # プロンプトを構築
            prompt = self._build_prompt(ingredients, cuisine_type, difficulty, cooking_time)
            
            # Gemini APIにリクエスト
            response = self.model.generate_content(prompt)
            
            # レスポンスをパース
            recipe_data = self._parse_response(response.text)
            
            return recipe_data
            
        except Exception as e:
            logger.error(f"レシピ生成中にエラーが発生しました: {str(e)}")
            raise
    
    def _build_prompt(self, ingredients, cuisine_type, difficulty, cooking_time):
        """レシピ生成用のプロンプトを構築"""
        prompt = "あなたは経験豊富な料理人です。以下の条件に基づいて、美味しいレシピを1つ提案してください。\n\n"
        
        if ingredients:
            prompt += f"使用したい材料: {ingredients}\n"
        if cuisine_type:
            prompt += f"料理の種類: {cuisine_type}\n"
        if difficulty:
            prompt += f"難易度: {difficulty}\n"
        if cooking_time:
            prompt += f"調理時間の目安: {cooking_time}分以内\n"
        
        prompt += """
以下の形式で回答してください：

【レシピ名】
（具体的で魅力的なレシピ名）

【材料】（2人分）
・材料1: 分量
・材料2: 分量
（必要な材料をすべて列挙）

【作り方】
1. 手順1の詳細な説明
2. 手順2の詳細な説明
（完成まで順序立てて説明）

【調理時間】
○分

【難易度】
簡単/普通/難しい

【コツ・ポイント】
料理を美味しく作るためのコツやポイント
"""
        
        return prompt
    
    def _parse_response(self, response_text):
        """Gemini APIのレスポンスをパースしてレシピデータに変換"""
        try:
            lines = response_text.strip().split('\n')
            recipe_data = {
                'title': '',
                'ingredients': '',
                'instructions': '',
                'cooking_time': None,
                'difficulty': 'medium',
                'tips': ''
            }
            
            current_section = None
            content_lines = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # セクションの判定
                if '【レシピ名】' in line or 'レシピ名' in line:
                    current_section = 'title'
                    continue
                elif '【材料】' in line or '材料' in line:
                    current_section = 'ingredients'
                    continue
                elif '【作り方】' in line or '作り方' in line:
                    current_section = 'instructions'
                    continue
                elif '【調理時間】' in line or '調理時間' in line:
                    current_section = 'cooking_time'
                    continue
                elif '【難易度】' in line or '難易度' in line:
                    current_section = 'difficulty'
                    continue
                elif '【コツ】' in line or '【ポイント】' in line or 'コツ' in line or 'ポイント' in line:
                    current_section = 'tips'
                    continue
                
                # 内容を各セクションに振り分け
                if current_section == 'title' and not recipe_data['title']:
                    recipe_data['title'] = line
                elif current_section == 'ingredients':
                    recipe_data['ingredients'] += line + '\n'
                elif current_section == 'instructions':
                    recipe_data['instructions'] += line + '\n'
                elif current_section == 'cooking_time':
                    # 数字を抽出
                    import re
                    time_match = re.search(r'(\d+)', line)
                    if time_match:
                        recipe_data['cooking_time'] = int(time_match.group(1))
                elif current_section == 'difficulty':
                    if '簡単' in line:
                        recipe_data['difficulty'] = 'easy'
                    elif '難しい' in line:
                        recipe_data['difficulty'] = 'hard'
                    else:
                        recipe_data['difficulty'] = 'medium'
                elif current_section == 'tips':
                    recipe_data['tips'] += line + '\n'
            
            # 空の場合のデフォルト値
            if not recipe_data['title']:
                recipe_data['title'] = '美味しいレシピ'
            if not recipe_data['ingredients']:
                recipe_data['ingredients'] = '材料情報が取得できませんでした'
            if not recipe_data['instructions']:
                recipe_data['instructions'] = '作り方の情報が取得できませんでした'
            
            # 末尾の改行を削除
            recipe_data['ingredients'] = recipe_data['ingredients'].strip()
            recipe_data['instructions'] = recipe_data['instructions'].strip()
            recipe_data['tips'] = recipe_data['tips'].strip()
            
            return recipe_data
            
        except Exception as e:
            logger.error(f"レスポンスのパース中にエラーが発生しました: {str(e)}")
            # エラー時のデフォルトレシピ
            return {
                'title': '簡単な料理',
                'ingredients': '適切な材料をご用意ください',
                'instructions': '基本的な調理手順に従ってください',
                'cooking_time': 30,
                'difficulty': 'medium',
                'tips': ''
            }