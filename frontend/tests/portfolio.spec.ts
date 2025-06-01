import { test, expect } from '@playwright/test'

test('ポートフォリオに企業を追加・編集・削除できる', async ({ page }) => {
  // 1. ポートフォリオページへ移動
  await page.goto('http://localhost:3000/portfolio')

  // === [ 追加 ] ===
  await page.getByPlaceholder('企業名').fill('Microsoft')
  await page.getByPlaceholder('株数').fill('15')
  await page.getByRole('button', { name: '追加' }).click()

  // 追加後の要素確認
  await expect(page.getByText('Microsoft')).toBeVisible()
  await expect(page.getByText('15')).toBeVisible()

  // === [ 編集 ] ===
  const editBtn = page.getByRole('button', { name: '編集' }).nth(0) // 1行目を編集
  await editBtn.click()

  const inputs = await page.locator('input').all()
  await inputs[2].fill('Tesla')
  await inputs[3].fill('20')

  await page.getByRole('button', { name: '保存' }).click()

  // 編集後の要素確認
  await expect(page.getByText('Tesla')).toBeVisible()
  await expect(page.getByText('20')).toBeVisible()

  // === [ 削除 ] ===
  const deleteBtn = await page.locator('tr', { hasText: 'Tesla' }).getByRole('button', { name: '削除' })
  await deleteBtn.click()

  // 削除後の確認（非表示になってるか）
  await expect(page.getByText('Tesla')).not.toBeVisible()
})
