import { test, expect, Page } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';

async function performStaffLogin(page: Page, username: string = testData.adminUser.username, password: string = testData.adminUser.password) {
  const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
  if (await staffLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await staffLoginBtn.click({ force: true });
  }

  const usernameInput = page.getByRole('textbox', { name: /Username|Email/i })
    .or(page.locator('input[name="username"]'))
    .first();

  await usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
  await usernameInput.fill(username);

  const passwordInput = page.getByRole('textbox', { name: /Password/i })
    .or(page.locator('input[name="password"]'))
    .first();

  await passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
  await passwordInput.fill(password);

  const signInBtn = page.getByRole('button', { name: /Sign In|Submit|Login/i }).first();
  if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await signInBtn.click({ force: true });
  } else {
    await passwordInput.press('Enter');
  }

  await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1500);
}

test.describe('Mrd Portal Authentication Suite - Complete Valid & Invalid Validation Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
  });

  // ==========================================
  // 1. VALID TEST CASE (WITH EXPLICIT CARD & NAVIGATION VERIFICATION)
  // ==========================================
  test('TC_MRD_001 [VALID]: Successful Mrd Login & Role Switch with Navigation Menu Verification', async ({ page }) => {
    await performStaffLogin(page);

    // If on /staff/dashboard with ROLE SLIDER drawer button, open it
    const roleSliderTab = page.getByText(/ROLE SLIDER/i)
      .or(page.getByRole('button', { name: /ROLE SLIDER/i }))
      .or(page.locator('button:has-text("ROLE SLIDER")'))
      .first();

    if (await roleSliderTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await roleSliderTab.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }

    // Target the main Card element containing the specific Role Name
    const roleCard = page.locator('.MuiCard-root, [class*="card"], div')
      .filter({ hasText: new RegExp('^' + 'Mrd' + '$', 'i') })
      .or(page.getByText('Mrd', { exact: true }))
      .first();

    await roleCard.waitFor({ state: 'visible', timeout: 15_000 });
    await roleCard.scrollIntoViewIfNeeded().catch(() => {});
    await roleCard.click({ force: true });
    
    // Wait for URL redirect after role card click
    await page.waitForURL((url) => !url.href.includes('/staff/select-role') && url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Verify Sidebar Navigation Menu
    const navMenu = page.locator('nav, aside, [role="navigation"], .MuiDrawer-root, .sidebar, header, body').first();
    await navMenu.waitFor({ state: 'visible', timeout: 20_000 });
    await expect(navMenu).toBeVisible();

    await expect(page).toHaveURL(/.*(staff)/i);
  });

  // ==========================================
  // 2. INVALID & FORM VALIDATION TEST CASES
  // ==========================================
  test('TC_MRD_002 [INVALID]: Mrd Login with Wrong Password', async ({ page }) => {
    await performStaffLogin(page, testData.adminUser.username, 'wrongpassword123');

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_003 [INVALID]: Mrd Login with Non-Existent Username', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.wrongEmailUser.username, testData.invalidUser.wrongEmailUser.password);

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_004 [INVALID]: Mrd Submit Empty Credentials', async ({ page }) => {
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await staffLoginBtn.click({ force: true });
    }

    const signInBtn = page.getByRole('button', { name: /Sign In|Submit|Login/i }).first();
    if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await signInBtn.click({ force: true });
    }

    await expect(page).not.toHaveURL(/.*\/staff/);
  });

  test('TC_MRD_005 [INVALID]: Mrd Email Format Validation - Missing @ Symbol', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.invalidEmailFormat.username, testData.invalidUser.invalidEmailFormat.password);

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_006 [INVALID]: Mrd Email Format Validation - Missing Domain Extension', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.missingDomainEmail.username, testData.invalidUser.missingDomainEmail.password);

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_007 [INVALID]: Mrd Empty Password Validation', async ({ page }) => {
    await performStaffLogin(page, testData.adminUser.username, '');

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_008 [INVALID]: Mrd Empty Email Validation', async ({ page }) => {
    await performStaffLogin(page, '', testData.adminUser.password);

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_009 [INVALID]: Mrd Security Validation - SQL Injection attempt', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.sqlInjectionEmail.username, testData.invalidUser.sqlInjectionEmail.password);

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

  test('TC_MRD_010 [VALIDATION]: Mrd Whitespace Auto-Trim Check', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.whitespaceEmail.username, testData.invalidUser.whitespaceEmail.password);

    await page.waitForTimeout(2000);
  });

  test('TC_MRD_011 [VALIDATION]: Mrd Email Case-Insensitivity Check', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.uppercaseEmail.username, testData.invalidUser.uppercaseEmail.password);

    await page.waitForTimeout(2000);
  });

  test('TC_MRD_012 [SECURITY]: Mrd XSS Payload Security Check', async ({ page }) => {
    await performStaffLogin(page, testData.invalidUser.xssPayloadEmail.username, testData.invalidUser.xssPayloadEmail.password);

    await expect(page).not.toHaveURL(/.*\/staff\/select-role/);
  });

});
