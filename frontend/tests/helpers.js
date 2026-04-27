import { expect } from '@playwright/test';

export function uniqueString(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function clearLocalStorage(page) {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
}

export async function loginAsNewsAdmin(page, email = 'news.admin@university.edu', password = 'NewsAdmin2026!') {
  await page.goto('/news-login');
  await page.fill('input[placeholder="news.admin@university.edu"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Secure Login")');
  await expect(page).toHaveURL(/\/admin\/news/);
  await expect(page.getByText('News Management')).toBeVisible();
}

export async function loginWithEmailPassword(page, email, password) {
  await page.goto('/login');
  await page.fill('input[placeholder="Email Address"]', email);
  await page.fill('input[placeholder="Password"]', password);
  await page.click('button:has-text("Log In")');
}
