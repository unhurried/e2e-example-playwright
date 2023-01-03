import { test, expect } from '@playwright/test';

test.describe('Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    await page.goto('http://localhost:3000/todos');
    await page.getByRole('button', { name: 'Sign in with oidc' }).click();
    await page.getByPlaceholder('Enter any login').click();
    await page.getByPlaceholder('Enter any login').fill('test-user');
    await page.getByPlaceholder('and password').click();
    await page.getByPlaceholder('and password').fill('test-password');
    await page.getByRole('button', { name: 'Sign-in' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: 'New Item' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('Shopping');
    await page.getByRole('combobox', { name: 'Category' }).selectOption('two');
    await page.getByLabel('Content').click();
    await page.getByLabel('Content').fill('Buy milk at the grocery store.');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/todos\/[0-9a-f-]{36}$/)

    await page.getByRole('button', { name: 'Back to List' }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/todos$/);
    const rows = page.locator('tbody > tr');
    await rows.waitFor()
    expect(await rows.count()).toEqual(1);

    await expect(page.getByRole('cell', { name: 'two' }).first()).toHaveText('two')
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await rows.waitFor({ state: 'detached' })
    expect(await rows.count()).toEqual(0);
  })
});
