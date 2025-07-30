FROM python:3.12-slim

# 作業ディレクトリを設定
WORKDIR /app

# システムパッケージのアップデートとインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Pythonの依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY . .

# SQLiteデータベース用のディレクトリを作成
RUN mkdir -p /app/data

# ポート8000を公開
EXPOSE 8000

# 環境変数を設定
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=recipper_project.settings

# 静的ファイルを収集（本番環境用）
RUN python manage.py collectstatic --noinput --clear

# マイグレーションを実行してからサーバーを起動
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]