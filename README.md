# Recipper - 料理レシピ提案WEBアプリ

Gemini APIを利用したDjangoベースの料理レシピ提案・管理アプリケーションです。

## 機能

- **AI レシピ生成**: Google Gemini APIを使用して、材料や好みに基づいたレシピを自動生成
- **レシピ管理**: レシピの作成、編集、削除、一覧表示
- **検索機能**: レシピ名や材料での検索
- **フィルタリング**: 難易度による絞り込み
- **レスポンシブデザイン**: スマートフォンからデスクトップまで対応

## 技術スタック

- **Backend**: Python 3.12 + Django 5.0
- **Database**: SQLite
- **AI API**: Google Gemini API
- **Frontend**: Bootstrap 5 + Font Awesome
- **Development**: Docker + Docker Compose

## セットアップ

### 前提条件

- Docker および Docker Compose がインストールされていること
- Google Gemini API キーが取得済みであること

### インストール手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/TakuyaFukumura/recipper.git
   cd recipper
   ```

2. **環境変数を設定**
   ```bash
   cp .env.example .env
   ```
   `.env` ファイルを編集して、Gemini API キーを設定してください:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Dockerでアプリケーションを起動**
   ```bash
   docker-compose up --build
   ```

4. **ブラウザでアクセス**
   http://localhost:8000 にアクセスしてアプリケーションを使用できます。

### 開発環境（Dockerを使わない場合）

1. **Python仮想環境を作成**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **依存関係をインストール**
   ```bash
   pip install -r requirements.txt
   ```

3. **データベースをセットアップ**
   ```bash
   python manage.py migrate
   ```

4. **開発サーバーを起動**
   ```bash
   python manage.py runserver
   ```

## 使用方法

### AI レシピ生成

1. ホームページで「AI でレシピ生成」ボタンをクリック
2. 使いたい材料、料理の種類、難易度、調理時間を入力（すべて任意）
3. 「AI でレシピを生成する」ボタンをクリック
4. 生成されたレシピが自動的に保存され、詳細ページに移動

### レシピ管理

- **作成**: 「レシピ作成」ページで手動でレシピを入力
- **一覧**: 「レシピ一覧」ページで全レシピを閲覧・検索
- **詳細**: 各レシピの詳細な材料と作り方を表示
- **編集**: 既存レシピの内容を修正
- **削除**: 不要なレシピを削除

### 管理画面

Django管理画面にアクセスするには、まずスーパーユーザーを作成してください:

```bash
python manage.py createsuperuser
```

その後、http://localhost:8000/admin/ にアクセスできます。

## API エンドポイント

RESTful APIも利用可能です:

- `GET /api/recipes/` - レシピ一覧取得
- `GET /api/recipes/{id}/` - 特定レシピの詳細取得

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `SECRET_KEY` | Django秘密鍵 | 開発用デフォルト値 |
| `DEBUG` | デバッグモード | `True` |
| `ALLOWED_HOSTS` | 許可ホスト | `localhost,127.0.0.1,0.0.0.0` |
| `GEMINI_API_KEY` | Gemini APIキー | （必須） |

## ディレクトリ構造

```
recipper/
├── recipper_project/          # Django プロジェクト設定
│   ├── settings.py           # メイン設定ファイル
│   ├── urls.py              # URL設定
│   └── ...
├── recipes/                  # レシピアプリ
│   ├── models.py            # データモデル
│   ├── views.py             # ビュー関数
│   ├── gemini_service.py    # Gemini API連携サービス
│   ├── templates/           # HTMLテンプレート
│   └── ...
├── requirements.txt         # Python依存関係
├── Dockerfile              # Docker設定
├── docker-compose.yml      # Docker Compose設定
├── .env.example           # 環境変数テンプレート
└── README.md              # このファイル
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストや課題報告を歓迎します。貢献する前に、既存の課題を確認してください。

## サポート

質問や問題がある場合は、GitHubのIssuesページで報告してください。
