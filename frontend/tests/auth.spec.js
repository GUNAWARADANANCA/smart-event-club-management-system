import { test, expect } from '@playwright/test';
import { uniqueString, clearLocalStorage } from './helpers';

const timestamp = Date.now();
const testUser = {
  name: `E2E User ${timestamp}`,
  email: `e2e.user.${timestamp}@example.com`,
  password: 'Test1234!',
};

test.describe.serial('Authentication module', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorage(page);
  });

  test('User registration', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[placeholder="Full Name"]', testUser.name);
    await page.fill('input[placeholder="Email Address"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.fill('input[placeholder="Confirm Password"]', testUser.password);
    await page.click('button:has-text("Register")');

    await expect(page.getByText('Log out')).toBeVisible();
    await expect(page.getByText(testUser.name)).toBeVisible();
  });

  test('User login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Email Address"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);
    await page.click('button:has-text("Log In")');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Log out')).toBeVisible();
  });

  test('Invalid login validation', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Email Address"]', `invalid.${uniqueString('user')}@example.com`);
    await page.fill('input[placeholder="Password"]', 'WrongPassword!');
    await page.click('button:has-text("Log In")');

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('Empty field validation', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Log In")');
    await expect(page.getByText('Please input your Email!')).toBeVisible();
    await expect(page.getByText('Please input your Password!')).toBeVisible();
  });
});
