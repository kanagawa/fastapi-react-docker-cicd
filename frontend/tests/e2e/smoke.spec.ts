import { test, expect } from '@playwright/test';

test.describe('システム疎通確認（スモークテスト）', () => {
  
  test('フロントエンドが正常に起動し、タイトルが表示される', async ({ page }) => {
    // 1. フロントエンドにアクセス
    await page.goto('/');

    // 2. ページタイトルの確認（Viteのデフォルトやアプリ名に合わせて調整）
    await expect(page).toHaveTitle(/Task Manager/i);
  });

  test('バックエンドAPIからデータを取得できている', async ({ page }) => {
    await page.goto('/');

    // 3. API経由で表示されるはずの要素（例: タスク一覧のコンテナ）を待機
    // コンポーネントに data-testid="task-list" を付与している想定
    const taskList = page.getByTestId('task-list');
    
    // 4. APIがエラーを返さず、何らかのコンテンツが表示されることを確認
    await expect(taskList).toBeVisible({ timeout: 10000 });
  });

});