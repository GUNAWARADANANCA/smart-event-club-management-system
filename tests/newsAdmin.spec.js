import { test, expect } from '@playwright/test';
import { uniqueString, clearLocalStorage, loginAsNewsAdmin } from './helpers';

const newsTitle = `E2E News ${Date.now()}`;
const updatedNewsTitle = `${newsTitle} Updated`;

test.describe.serial('News Admin module', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorage(page);
  });

  test('Admin login', async ({ page }) => {
    await loginAsNewsAdmin(page);
  });

  test('Add news', async ({ page }) => {
    await loginAsNewsAdmin(page);
    await page.click('button:has-text("Add News")');
    await page.waitForSelector('.ant-modal', { state: 'visible', timeout: 5000 });

    await page.fill('input[placeholder="Enter news title"]', newsTitle);
    await page.fill('textarea[placeholder="Enter news summary"]', 'This is a Playwright created news summary.');
    
    // Try a different approach for the dropdown
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.waitForTimeout(2000); // Wait even longer
    await page.keyboard.type('Academic');
    await page.keyboard.press('Enter');
    await page.fill('input[placeholder="e.g., 🏆 Achievement"]', '🎓 Test');
    await page.fill('input[placeholder="Enter author name"]', 'E2E Reporter');
    await page.getByRole('combobox', { name: 'Color Scheme' }).click();
    await page.waitForTimeout(2000); // Wait even longer
    await page.keyboard.type('Green');
    await page.keyboard.press('Enter');
    await page.click('button:has-text("Save")');

    await expect(page.locator('td', { hasText: newsTitle })).toBeVisible();
  });

  test('View news', async ({ page }) => {
    await loginAsNewsAdmin(page);
    await expect(page.locator('td', { hasText: newsTitle })).toBeVisible();
  });

  test('Edit news', async ({ page }) => {
    await loginAsNewsAdmin(page);
    const row = page.locator('tr', { hasText: newsTitle }).first();
    await row.getByRole('button', { name: 'Edit' }).click();

    await page.fill('input[placeholder="Enter news title"]', updatedNewsTitle);
    await page.click('button:has-text("Save")');

    await expect(page.locator('td', { hasText: updatedNewsTitle })).toBeVisible();
  });

  test('Delete news', async ({ page }) => {
    await loginAsNewsAdmin(page);
    const row = page.locator('tr', { hasText: updatedNewsTitle }).first();
    await row.getByRole('button', { name: 'Delete' }).click();

    await page.click('button:has-text("Yes")');
    await expect(page.locator('td', { hasText: updatedNewsTitle })).not.toBeVisible();
  });
});
