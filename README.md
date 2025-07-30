# Recipper - 料理レシピ提案WEBアプリ

Gemini AIを使用した料理レシピ提案・管理アプリケーションです。

## 🍳 特徴

- **AIレシピ生成**: Gemini APIを使用して、材料や好みに基づいたレシピを自動生成
- **レシピ管理**: 生成・保存したレシピの一覧表示、編集、削除
- **データベース**: SQLite + Prismaで安全なデータ管理
- **レスポンシブデザイン**: Tailwind CSSによるモダンなUI
- **Docker対応**: ローカル開発環境の簡単セットアップ
- **Vercel対応**: 本番環境への簡単デプロイ

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **UI**: Tailwind CSS + Lucide React
- **データベース**: SQLite + Prisma ORM
- **AI**: Google Gemini API
- **デプロイ**: Vercel

## 📋 前提条件

- Node.js 20以上
- npm または yarn
- Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey)から取得)

## 🛠️ ローカル開発セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/TakuyaFukumura/recipper.git
cd recipper
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定：

```env
# SQLite database
DATABASE_URL="file:./dev.db"

# Gemini API Key (https://makersuite.google.com/app/apikey)
GEMINI_API_KEY="your_api_key_here"
```

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースの作成とマイグレーション実行
npx prisma migrate dev --name init
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスできます。

## 🐳 Docker での開発

### 1. 環境変数の設定

プロジェクトルートに`.env`ファイルを作成：

```env
GEMINI_API_KEY=your_api_key_here
```

### 2. Docker Composeで起動

```bash
docker-compose up -d
```

### 3. アクセス

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスできます。

## 📊 データベース管理

### Prisma Studio（データベースGUI）

```bash
npx prisma studio
```

### マイグレーション

```bash
# 新しいマイグレーションの作成
npx prisma migrate dev --name migration_name

# マイグレーションの適用
npx prisma migrate deploy
```

### データベースのリセット

```bash
npx prisma migrate reset
```

## 🚀 Vercelでのデプロイ

### 1. Vercelアカウントでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "New Project"をクリック
3. GitHubリポジトリを選択してインポート

### 2. 環境変数の設定

Vercelプロジェクトの設定で以下の環境変数を設定：

```
DATABASE_URL="file:./prod.db"
GEMINI_API_KEY="your_api_key_here"
```

### 3. ビルド設定

Vercelは自動的に以下を実行します：

```bash
npm run build
```

### 4. デプロイ

GitHubにプッシュすると自動的にデプロイされます。

## 📝 使用方法

### レシピ生成

1. "レシピ生成"タブをクリック
2. 使いたい材料を入力
3. 料理の種類、難易度、調理時間を設定
4. 食事制限やこだわりを追加（オプション）
5. "レシピを生成"ボタンをクリック
6. 生成されたレシピを確認・保存

### レシピ管理

- **一覧表示**: "レシピ一覧"タブで保存されたレシピを確認
- **詳細表示**: レシピカードをクリックして詳細を表示
- **編集**: レシピカードの"編集"ボタンをクリック
- **削除**: レシピカードの"削除"ボタンをクリック

## 🛠️ 開発コマンド

```bash
# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバーの起動
npm start

# ESLintでのコード検証
npm run lint

# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev
```

## 📁 プロジェクト構造

```
recipper/
├── prisma/
│   └── schema.prisma           # データベーススキーマ
├── src/
│   ├── app/
│   │   ├── api/                # API Routes
│   │   │   ├── recipes/        # レシピCRUD API
│   │   │   └── generate/       # レシピ生成API
│   │   ├── layout.tsx          # レイアウトコンポーネント
│   │   └── page.tsx            # メインページ
│   ├── components/             # Reactコンポーネント
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   └── RecipeGenerator.tsx
│   ├── lib/                    # ユーティリティ
│   │   ├── prisma.ts           # Prismaクライアント
│   │   └── gemini.ts           # Gemini API連携
│   └── types/                  # TypeScript型定義
│       └── recipe.ts
├── public/                     # 静的ファイル
├── Dockerfile                  # 本番用Docker設定
├── Dockerfile.dev              # 開発用Docker設定
├── docker-compose.yml          # Docker Compose設定
└── README.md                   # このファイル
```

## 🔧 トラブルシューティング

### Prismaエラー

```bash
# Prismaクライアントの再生成
npx prisma generate

# データベースの同期
npx prisma db push
```

### 依存関係の問題

```bash
# node_modulesの削除と再インストール
rm -rf node_modules package-lock.json
npm install
```

### Gemini API エラー

- APIキーが正しく設定されているか確認
- API利用制限に達していないか確認
- ネットワーク接続を確認

## 📄 ライセンス

MIT License

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、GitHubのIssuesページでお気軽にお問い合わせください。
