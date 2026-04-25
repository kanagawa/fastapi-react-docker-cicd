# GitHub Actions CI/CD ワークフロー テンプレート集

このディレクトリ内の各ワークフロー YAML ファイルは、FastAPI + React フルスタック環境での CI/CD パイプラインの実装例です。他のリポジトリで転用する際の参考として、各ワークフローの役割と変更項目をまとめています。

---

## 📋 ワークフロー一覧

### 1. `backend-ci.yml` - バックエンド Lint・Type Check・テスト

#### 概要
Python（FastAPI）バックエンドのコード品質を自動検証します。

**実行トリガー**
- `backend/**` 配下のファイル変更時
- 全ブランチへのプッシュと PR 時に実行

**実行内容**
- `poetry install` で依存関係をインストール
- **Ruff**: フォーマットチェック（`ruff format --check`）と Lint（`ruff check`）
- **Mypy**: 型チェック（`mypy src`）
- **Pytest**: ユニットテスト（`PYTHONPATH=src poetry run pytest`）

#### 他のリポジトリへの転用時の変更項目

| 項目 | 変更前 | 変更後 | 備考 |
|------|--------|--------|------|
| Python バージョン | `3.10` | `3.11` 等 | 使用中の Python version に合わせる |
| Mypy チェック対象 | `src` | `app` 等 | プロジェクト構成に合わせる |
| Pytest コマンド | `PYTHONPATH=src poetry run pytest` | `pytest` 等 | `package-mode` 設定により異なる |
| paths フィルター | `['backend/**', 'openapi.json']` | 自プロジェクトの構造に合わせる | 不要な CI 実行を削減 |

**カスタマイズ例**
```yaml
# 標準的な package-mode=true の場合
- name: Run Pytest
  run: poetry run pytest

# package-mode=false で特定ディレクトリをテストする場合
- name: Run Pytest
  run: PYTHONPATH=src poetry run pytest tests/
```

---

### 2. `frontend-ci.yml` - フロントエンド Lint・型チェック・テスト

#### 概要
React/TypeScript フロントエンドのコード品質を自動検証します。

**実行トリガー**
- `frontend/**` 配下のファイル変更時
- 全ブランチへのプッシュと PR 時に実行

**実行内容**
- `npm ci` で依存関係をインストール（更新なし、推奨）
- **ESLint**: Lint チェック（`npm run lint`）
- **Vitest**: ユニットテスト（`npx vitest run`）
- **TypeScript**: ビルドチェック（`npm run build`）

#### 他のリポジトリへの転用時の変更項目

| 項目 | 変更前 | 変更後 | 備考 |
|------|--------|--------|------|
| Node.js バージョン | `24` | `20` 等 | プロジェクト要件に合わせる |
| package manager | `npm` | `pnpm`、`yarn` 等 | 環境に合わせる |
| Lint コマンド | `npm run lint` | `npm run lint:fix` 等 | スクリプト定義に合わせる |
| テストコマンド | `npx vitest run` | `npm run test` 等 | テストランナーに合わせる |
| paths フィルター | `['frontend/**', 'openapi.json']` | 自プロジェクトの構造に合わせる | 不要な CI 実行を削減 |

**カスタマイズ例 (pnpm 使用の場合)**
```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Run ESLint
  run: pnpm run lint

- name: Run Tests
  run: pnpm run test
```

---

### 3. `backend-docker-check.yml` - バックエンド Docker イメージビルド・起動確認

#### 概要
バックエンド Docker イメージが正常にビルドでき、起動するか検証します。

**実行トリガー**
- `backend/**` 配下のファイル変更時
- PR 時に実行（`pull_request` branches: `["main"]`）

**実行内容**
- `docker build` でイメージをビルド
- `docker run` でコンテナ起動
- `curl` で `/docs` エンドポイントへのアクセスを確認（ポート 8000）
- タイムアウト 30 秒の待機機構あり
- `if: always()` でクリーンアップ確実実行

#### 他のリポジトリへの転用時の変更項目

| 項目 | 変更前 | 変更後 | 備考 |
|------|--------|--------|------|
| Dockerfile パス | `./backend/docker/Dockerfile` | 自プロジェクトのパス | Docker ファイルの位置 |
| イメージ名 | `backend-test` | `app-backend-test` 等 | 識別しやすい名前に |
| コンテナ名 | `backend-container` | `app-backend-test` 等 | 識別しやすい名前に |
| ポート | `8000:8000` | `3000:3000` 等 | サーバーポートに合わせる |
| ヘルスチェック URL | `localhost:8000/docs` | 実際のエンドポイント | 起動確認できる URL |
| タイムアウト | `30s` | `60s` 等 | ビルド・起動時間に合わせる |

**カスタマイズ例 (Next.js の場合)**
```yaml
- name: Build Backend Image
  run: docker build -t app-frontend-test -f ./frontend/Dockerfile ./frontend

- name: Test Frontend Container Startup
  run: |
    docker run -d --name app-frontend-container -p 3000:3000 app-frontend-test
    timeout 60s bash -c 'until curl -s localhost:3000 > /dev/null; do sleep 2; done'
    docker ps | grep app-frontend-container
```

---

### 4. `frontend-docker-check.yml` - フロントエンド Docker イメージビルド・起動確認

#### 概要
フロントエンド Docker イメージが正常にビルドでき、起動するか検証します。

**実行トリガー**
- `frontend/**` 配下のファイル変更時
- PR 時に実行（`pull_request` branches: `["main"]`）

**実行内容**
- `docker build` でイメージをビルド
- `docker run` でコンテナ起動
- `curl` で ルート `/` へのアクセスを確認（ポート 5173）
- タイムアウト 30 秒の待機機構あり
- `if: always()` でクリーンアップ確実実行

#### 他のリポジトリへの転用時の変更項目

| 項目 | 変更前 | 変更後 | 備考 |
|------|--------|--------|------|
| Dockerfile パス | `./frontend/docker/Dockerfile` | 自プロジェクトのパス | Docker ファイルの位置 |
| イメージ名 | `frontend-test` | `app-web-test` 等 | 識別しやすい名前に |
| コンテナ名 | `frontend-container` | `app-web-test` 等 | 識別しやすい名前に |
| ポート | `5173:5173` | `3000:3000` 等 | フロントエンドポート |
| ヘルスチェック URL | `localhost:5173` | `/health` 等 | 起動確認できる URL |

---

### 5. `api-contract-check.yml` - API スキーマ整合性チェック

#### 概要
バックエンドの OpenAPI スキーマを抽出し、フロントエンドの型定義との整合性を自動検証します。

**実行トリガー**
- `backend/**` または `frontend/**` 配下のファイル変更時

**実行内容**
1. Python 環境セットアップ → Poetry 依存関係インストール
2. FastAPI から OpenAPI スキーマ を JSON 出力（`openapi_new.json`）
3. Node.js 環境セットアップ
4. **Orval** で TypeScript 型定義を自動生成
5. **TypeScript コンパイラ** で型チェック（`tsc --noEmit`）

#### 他のリポジトリへの転用時の変更項目

| 項目 | 変更前 | 変更後 | 備考 |
|------|--------|--------|------|
| Python バージョン | `3.11` | 使用中のバージョン | バックエンド環境に合わせる |
| Node.js バージョン | `24` | `20` 等 | フロントエンド環境に合わせる |
| OpenAPI スキーマ抽出方法 | `from main import app` | 実装に合わせる | FastAPI アプリのインポートパス |
| Orval 設定ファイル | `frontend/orval.config.js` | 自プロジェクトのパス | 設定ファイルの位置 |
| 型定義出力先 | `src/api/generated/` | 自プロジェクトのディレクトリ | orval.config.js の output 設定に合わせる |

**カスタマイズ例 (異なるスキーマ抽出方法)**
```yaml
# OpenAPI スキーマを JSON ファイルから読み込む場合
- name: Extract OpenAPI Schema
  run: |
    cd backend && cp openapi.json ../openapi_new.json

# FastAPI アプリのモジュール構成が異なる場合
- name: Extract OpenAPI Schema
  run: |
    cd backend && PYTHONPATH=src poetry run python -c "
    import json
    from app.main import create_app
    app = create_app()
    print(json.dumps(app.openapi()))
    " > ../openapi_new.json
```

---

## 🔧 共通設定項目

### paths フィルター
不要な CI 実行を削減するため、各ワークフローは `paths` で対象ディレクトリを指定しています。

```yaml
on:
  push:
    branches: ["**"]
    paths: ['backend/**', 'openapi.json']  # ← これを指定すると、backend や openapi.json に変更がないと実行されない
```

他のリポジトリでは、自身のディレクトリ構造に合わせて変更してください：

```yaml
# 例: app/, src/ 配下をテスト対象にする場合
paths: ['app/**', 'src/**', '**.github/workflows/backend-ci.yml']

# 例: docker-compose.yml も監視対象にする場合
paths: ['backend/**', 'docker-compose.yml', '**.github/workflows/**']
```

### ブランチフィルター
各ワークフローのトリガーを制限できます：

```yaml
# 全ブランチで実行（現在の設定）
branches: ["**"]

# main ブランチのみで実行
branches: ["main"]

# main と develop ブランチで実行
branches: ["main", "develop"]
```

---

## 📝 転用時のチェックリスト

新しいリポジトリにワークフローを転用する際、以下をご確認ください：

- [ ] バックエンド言語・バージョンを確認
- [ ] フロントエンド言語・バージョン・パッケージマネージャーを確認
- [ ] 各ツール（Ruff, Mypy, ESLint, Vitest 等）の設定ファイルが存在するか確認
- [ ] ディレクトリ構成を確認し、`paths` と `working-directory` を調整
- [ ] Docker イメージビルドが必要な場合、Dockerfile パスとポート設定を確認
- [ ] API スキーマ抽出が必要な場合、FastAPI アプリのインポートパスを確認
- [ ] 各ワークフローの実行に必要な環境変数（`PYTHONPATH` など）を確認

---

## 🚀 使用方法

1. このリポジトリのワークフロー YAML を新しいリポジトリの `.github/workflows/` にコピー
2. 上記チェックリストに従い、各ワークフローを編集
3. Git にコミット・プッシュして、PR を作成
4. GitHub Actions タブで実行結果を確認

---

## 📚 参考資料

- [GitHub Actions: Workflow syntax for YAML](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions: Filtering for workflow runs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpaths)
- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [Mypy Documentation](https://mypy.readthedocs.io/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Vitest Documentation](https://vitest.dev/)
- [Orval Documentation](https://orval.dev/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
