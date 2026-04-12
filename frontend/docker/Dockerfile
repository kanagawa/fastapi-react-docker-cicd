# 1. ベースイメージ
FROM node:24-slim

# 2. 作業ディレクトリ
WORKDIR /app

# 3. 依存関係のインストール
# 先に package.json 類をコピーしてキャッシュを効かせます
# context が frontend/ なので、./package.json で参照可能
COPY package*.json ./
RUN npm install

# 4. ソースコードのコピー
COPY . .

# 5. Viteの開発サーバを起動
# --host 0.0.0.0 を指定しないとコンテナ外（ブラウザ）からアクセスできません
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]