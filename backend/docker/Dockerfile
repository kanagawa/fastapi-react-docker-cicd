# 1. ベースイメージの指定
FROM python:3.14-slim

# 2. 環境変数の設定
# Pythonがpycファイルを作成しないようにし、バッファリングを無効化してログをリアルタイムで見れるようにします
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    PATH="$POETRY_HOME/bin:$PATH"

# PATHにPoetryのバイナリディレクトリを追加（ここが重要）
ENV PATH="$POETRY_HOME/bin:$PATH"

# 3. 必要なシステムパッケージのインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 4. Poetryのインストール
RUN curl -sSL https://install.python-poetry.org | python3 -

# 5. 作業ディレクトリの設定
WORKDIR /app

# 6. 依存関係ファイルのコピーとインストール
# 先に依存関係だけをインストールすることで、ソースコードの変更時に
# 重いインストール処理をスキップ（キャッシュ利用）できます
COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-root --only main

# 7. ソースコードのコピー
# 現在の構成に合わせて、backendディレクトリ全体をコピーします
COPY . .

# 8. PYTHONPATHの設定
# 実行時に src ディレクトリ配下をモジュールとして認識させるために必要です
ENV PYTHONPATH=/app/src

# 9. アプリケーションの起動
# src/backend/main.py 内の app インスタンスを起動します
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]