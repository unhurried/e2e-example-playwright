import { test, expect } from '@playwright/test';

test.describe('Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/todos');
    await page.getByRole('button', { name: 'Sign in with oidc' }).click();
    await page.getByPlaceholder('Enter any login').click();
    await page.getByPlaceholder('Enter any login').fill('test-user-' + Math.random().toString(36).substring(2,7));
    await page.getByPlaceholder('and password').click();
    await page.getByPlaceholder('and password').fill('test-password');
    await page.getByRole('button', { name: 'Sign-in' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Add a new item.
    await page.getByRole('button', { name: 'New Item' }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('Shopping');
    await page.getByRole('combobox', { name: 'Category' }).selectOption('two');
    await page.getByLabel('Content').click();
    await page.getByLabel('Content').fill('Buy milk at the grocery store.');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/todos\/[0-9a-f-]{36}$/)

    // Assert the new item is shown in the list page.
    await page.getByRole('button', { name: 'Back to List' }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/todos$/);
    let rows = page.locator('tbody > tr');
    await rows.waitFor();
    expect(await rows.count()).toEqual(1);
    expect(page.locator('tbody > tr > td:nth-child(1)')).toHaveText('two');
    expect(page.locator('tbody > tr > td:nth-child(2)')).toHaveText('Shopping');

    // Update the item.
    await page.getByRole('button', { name: 'Update' }).first().click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('Shopping at the grocery store');
    await page.getByRole('combobox', { name: 'Category' }).selectOption('three');
    await page.getByLabel('Content').click();
    await page.getByLabel('Content').fill('Buy milk and eggs at the grocery store.');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assert if the list page is updated.
    await page.getByRole('button', { name: 'Back to List' }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/todos$/);
    rows = page.locator('tbody > tr');
    await rows.waitFor();
    expect(page.locator('tbody > tr > td:nth-child(1)')).toHaveText('three');
    expect(page.locator('tbody > tr > td:nth-child(2)')).toHaveText('Shopping at the grocery store');

    // Delete the item.
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await rows.waitFor({ state: 'detached' })
    expect(await rows.count()).toEqual(0);
  })
});
