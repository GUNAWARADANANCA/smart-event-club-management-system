import { test, expect } from '@playwright/test';
import { uniqueString, clearLocalStorage } from './helpers';

test.describe('Feedback module', () => {
  test.beforeEach(async ({ page }) => {
    await clearLocalStorage(page);
  });

  test('Submit feedback', async ({ page }) => {
    await page.goto('/feedback');
    await page.waitForSelector('form', { state: 'visible' });

    await page.fill('input[placeholder="Enter your name"]', 'E2E Feedback User');
    // Click on a 4-star rating
    await page.locator('.ant-rate-star:nth-child(4)').click();
    await page.locator('.ant-radio-button-wrapper:has-text("General")').click();
    await page.fill('input[placeholder="Briefly describe your feedback"]', 'Playwright feedback test');
    await page.fill('textarea[placeholder="Tell us exactly what you think..."]', 'This is a test message for the feedback module.');
    await page.click('button:has-text("SUBMIT FEEDBACK")');

    await expect(page.getByRole('heading', { name: 'Submitted Successfully!' })).toBeVisible();
  });

  test('View submitted feedback', async ({ page }) => {
    const subject = `E2E feedback ${Date.now()}`;
    await page.goto('/feedback');
    await page.waitForSelector('form', { state: 'visible' });

    await page.fill('input[placeholder="Enter your name"]', 'E2E Feedback Viewer');
    // Click on a 5-star rating
    await page.locator('.ant-rate-star:nth-child(5)').click();
    await page.locator('.ant-radio-button-wrapper:has-text("Bug Report")').click();
    await page.fill('input[placeholder="Briefly describe your feedback"]', subject);
    await page.fill('textarea[placeholder="Tell us exactly what you think..."]', 'Verifying submitted feedback appears in the feedback center.');
    await page.click('button:has-text("SUBMIT FEEDBACK")');
    await expect(page.getByRole('heading', { name: 'Submitted Successfully!' })).toBeVisible();

    await page.goto('/view-feedback');
    await expect(page.getByRole('heading', { name: /Feedback Center/i })).toBeVisible();
    await expect(page.locator('td', { hasText: subject })).toBeVisible();
  });

  test('Edit feedback if available', async ({ page }) => {
    const originalSubject = `E2E feedback ${Date.now()}`;
    const updatedSubject = `Updated ${originalSubject}`;

    // First, submit a feedback
    await page.goto('/feedback');
    await page.waitForSelector('form', { state: 'visible' });

    await page.fill('input[placeholder="Enter your name"]', 'E2E Editor');
    await page.locator('.ant-rate-star:nth-child(5)').click(); // 5-star rating
    await page.locator('.ant-radio-button-wrapper:has-text("Bug Report")').click();
    await page.fill('input[placeholder="Briefly describe your feedback"]', originalSubject);
    await page.fill('textarea[placeholder="Tell us exactly what you think..."]', 'Original feedback message for editing.');
    await page.click('button:has-text("SUBMIT FEEDBACK")');
    await expect(page.getByRole('heading', { name: 'Submitted Successfully!' })).toBeVisible();

    // Now go to view feedback and edit it
    await page.goto('/view-feedback');
    await expect(page.getByRole('heading', { name: /Feedback Center/i })).toBeVisible();

    // Find the feedback row and click edit
    const feedbackRow = page.locator('tr', { hasText: originalSubject });
    await expect(feedbackRow).toBeVisible();

    // Click the edit button in the action column
    await feedbackRow.locator('button:has-text("Edit")').first().click();

    // Wait for edit modal to open
    await page.waitForSelector('.ant-modal', { state: 'visible' });
    await expect(page.locator('.ant-modal-title').filter({ hasText: 'Edit feedback' })).toBeVisible();

    // Clear and update the subject field
    const subjectInput = page.locator('input[placeholder="Brief subject"]');
    await subjectInput.clear();
    await subjectInput.fill(updatedSubject);

    // Save changes
    await page.click('button:has-text("Save changes")');

    // Wait for modal to close and verify the update
    await page.waitForSelector('.ant-modal', { state: 'hidden' });
    await expect(page.locator('td', { hasText: updatedSubject })).toBeVisible();
  });

  test('Delete feedback if available', async ({ page }) => {
    const subjectToDelete = `E2E feedback to delete ${Date.now()}`;

    // First, submit a feedback
    await page.goto('/feedback');
    await page.waitForSelector('form', { state: 'visible' });

    await page.fill('input[placeholder="Enter your name"]', 'E2E Deleter');
    await page.locator('.ant-rate-star:nth-child(3)').click(); // 3-star rating
    await page.locator('.ant-radio-button-wrapper:has-text("Feature Request")').click();
    await page.fill('input[placeholder="Briefly describe your feedback"]', subjectToDelete);
    await page.fill('textarea[placeholder="Tell us exactly what you think..."]', 'This feedback will be deleted.');
    await page.click('button:has-text("SUBMIT FEEDBACK")');
    await expect(page.getByRole('heading', { name: 'Submitted Successfully!' })).toBeVisible();

    // Now go to view feedback and delete it
    await page.goto('/view-feedback');
    await expect(page.getByRole('heading', { name: /Feedback Center/i })).toBeVisible();

    // Find the feedback row and click delete
    const feedbackRow = page.locator('tr', { hasText: subjectToDelete });
    await expect(feedbackRow).toBeVisible();

    // Click the delete button in the action column
    await feedbackRow.locator('button:has-text("Delete")').first().click();

    // Wait for confirmation modal and click the delete button in the modal
    await page.waitForSelector('.ant-modal-confirm', { state: 'visible' });
    await expect(page.locator('.ant-modal-confirm-title').filter({ hasText: 'Delete feedback' })).toBeVisible();

    // Click the danger delete button in the confirmation modal
    await page.locator('.ant-modal-confirm').getByRole('button', { name: 'Delete' }).click();

    // Verify the feedback is deleted
    await expect(page.locator('td', { hasText: subjectToDelete })).not.toBeVisible();
  });
});
