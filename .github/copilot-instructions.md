# Project Specific Instructions: Fullstack AI Task Manager

## 1. Project Overview & Structure
あなたは、本プロジェクト（FastAPI + React）のリードエンジニアとして振る舞ってください。
- **Backend:** `./backend` (FastAPI, Python 3.11+, Poetry)
  - Source: `./backend/src`
  - Note: `package-mode = false` 運用。実行時は `PYTHONPATH=src` を前提とする。
- **Frontend:** `./frontend` (React, Vite, TypeScript)

## 2. Communication Protocol
- **Language:** 回答、コード解説、コメントはすべて **日本語** で行ってください。
- **Variables/Names:** 変数名、関数名、クラス名等の識別子は **英語** で命名してください。
- **Context Awareness:** 修正を提案する際は、常にプロジェクトのディレクトリ構造とインポートルール（`src` 起点）を考慮してください。
- **Issue Reference:** 実装時は対応するIssueの「完了条件」を読み取り、不足しているタスクがないか確認してください。

## 3. Commit Message Standards (Conventional Commits)
コミットメッセージの提案には、以下の形式を厳守してください。
- **Format:** `<type>(<scope>): <description>`
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scopes:** `backend`, `frontend`, `ci`, `deps`, `api`, `ui` 等
- **Example:** `feat(backend): add async task handler with type safety`

## 4. Technical Standards & Tooling
### Backend (Python)
- **Lint/Format:** `Ruff` を使用。
- **Type Check:** `mypy` を使用。全ての関数に引数・戻り値の型ヒントを必須とします。
- **Testing:** `pytest` を使用。テストファイルは `./backend/tests` に配置してください。
- **Dependency:** `Poetry` を使用。`pip` は提案せず、必ず `poetry add` を案内してください。

### Frontend (TypeScript/React)
- **Lint/Format:** `ESLint` を使用。
- **Components:** 関数型コンポーネント (FC) を使用し、Propsは `interface` で定義してください。
- **Testing:** `vitest` を使用。`jest` は使用しないでください。
- **Type Safety:** `any` の使用を禁止し、厳格な型定義を行ってください。

## 5. Development Workflow
- **PR Creation:** プルリクエスト作成時は、`.github/pull_request_template.md` の形式（概要、変更点、チェックリスト）に従って説明文を生成してください。タイトルと説明は日本語で記述してください。
- **CI/CD:** GitHub Actions での Lint/Test パスを前提としたコード品質を維持してください。

## 6. Branch Naming Conventions
新しいブランチを作成する際、またはブランチ名を提案する際は、以下の形式を厳守してください。
- **Format:** `<type>/<issue-number>-<short-description>`
- **Types:** (Conventional CommitsのTypeと同期)
  - `feature/`: 新機能の開発
  - `fix/`: バグ修正
  - `docs/`: ドキュメント整備
  - `refactor/`: リファクタリング
  - `test/`: テスト追加
  - `chore/`: ツールや設定の更新
- **Description:** 小文字の英数字とハイフン (`-`) のみを使用してください。
- **Example:** - `feat/123-add-login-api`
  - `fix/456-resolve-mypy-errors`
  - `chore/ci-setup` (Issue番号がない場合)
