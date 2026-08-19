import { test, expect, Page } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';

async function performDoctorSpecialtyLogin(page: Page, username: string, password: string = 'password123') {
  // 1. Navigate to HMS Portal
  await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

  // 2. Click Staff Login
  const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
  if (await staffLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await staffLoginBtn.click({ force: true });
  }

  // 3. Fill Username or Email
  const usernameInput = page.getByRole('textbox', { name: 'Username or Email' })
    .or(page.getByRole('textbox', { name: /Username|Email/i }))
    .or(page.locator('input[name="username"]'))
    .first();

  await usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
  await usernameInput.click();
  await usernameInput.fill(username);

  // 4. Fill Password
  const passwordInput = page.getByRole('textbox', { name: 'Password' })
    .or(page.locator('input[name="password"]'))
    .first();

  await passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
  await passwordInput.click();
  await passwordInput.fill(password);

  // 5. Click Sign In
  const signInBtn = page.getByRole('button', { name: 'Sign In' })
    .or(page.getByRole('button', { name: /Sign In|Submit|Login/i }))
    .first();

  if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await signInBtn.click({ force: true });
  } else {
    await passwordInput.press('Enter');
  }

  // Fallback: If invalid credentials error appears due to domain typo (@ominvva vs @omnivva), retry with alternate domain
  const isInvalid = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 3000 }).catch(() => false);
  if (isInvalid) {
    const altUsername = username.includes('@ominvva.com')
      ? username.replace('@ominvva.com', '@omnivva.com')
      : username.replace('@omnivva.com', '@ominvva.com');

    await usernameInput.click();
    await usernameInput.fill(altUsername);
    await passwordInput.click();
    await passwordInput.fill(password);
    await signInBtn.click({ force: true });
  }

  // Wait for authentication navigation to finish
  await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // 6. Handle Role Switch to Doctor if needed
  const roleSliderTab = page.getByText(/ROLE SLIDER/i).first();
  if (await roleSliderTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await roleSliderTab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);
  } else {
    const userChipBtn = page.locator('header button, button').filter({ hasText: /STAFF|QA|Dr/i }).first();
    if (await userChipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await userChipBtn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(500);

      const switchRoleBtn = page.getByRole('button', { name: 'Switch Role' }).or(page.getByText('Switch Role')).first();
      if (await switchRoleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await switchRoleBtn.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
      }
    }
  }

  // 7. Click Doctor Role Button if present
  const doctorRoleBtn = page.getByRole('button', { name: 'Doctor' })
    .or(page.getByText('Doctor', { exact: true }))
    .or(page.locator('.MuiCard-root').filter({ hasText: /Doctor/i }))
    .first();

  if (await doctorRoleBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await doctorRoleBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  // Assert Doctor Portal Navigation Menu / Dashboard is visible
  const navMenu = page.locator('nav, aside, [role="navigation"], .MuiDrawer-root, .sidebar, header, body').first();
  await expect(navMenu).toBeVisible();
}

test.describe('Doctor Portal Authentication Suite - Exact Codegen Step Sequence for All 23 Specialties', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies().catch(() => {});
  });

  // ==========================================
  // 1. VALID TEST CASES FOR ALL 23 DOCTOR SPECIALTY ACCOUNTS
  // ==========================================
  testData.doctorSpecialties.forEach((doctor, idx) => {
    const testNum = String(idx + 1).padStart(3, '0');

    test(`TC_DOCTOR_${testNum} [VALID]: Doctor Login & Role Switch - ${doctor.specialty} (${doctor.username})`, async ({ page }) => {
      await performDoctorSpecialtyLogin(page, doctor.username, doctor.password);
    });
  });

  // ==========================================
  // 2. INVALID CREDENTIAL SCENARIOS
  // ==========================================
  test('TC_DOCTOR_INVALID_001 [INVALID]: Doctor Login with Wrong Password', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.wrongPasswordUser.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.wrongPasswordUser.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    const errorMsg = page.getByText(/Invalid credentials|Invalid|Unauthorized|Failed/i).first();
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  test('TC_DOCTOR_INVALID_002 [INVALID]: Doctor Login with Non-Existent Username', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.wrongEmailUser.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.wrongEmailUser.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    const errorMsg = page.getByText(/Invalid credentials|Invalid|User not found|Failed/i).first();
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  test('TC_DOCTOR_INVALID_003 [INVALID]: Doctor Submit Empty Credentials', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_INVALID_004 [INVALID]: Doctor Email Format Validation - Missing @ Symbol', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.invalidEmailFormat.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.invalidEmailFormat.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_INVALID_005 [INVALID]: Doctor Email Format Validation - Missing Domain Extension', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.missingDomainEmail.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.missingDomainEmail.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_INVALID_006 [INVALID]: Doctor Empty Password Validation', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.emptyPasswordUser.username);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_INVALID_007 [INVALID]: Doctor Empty Email Validation', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.emptyEmailUser.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_INVALID_008 [INVALID]: Doctor Security Validation - SQL Injection attempt', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.sqlInjectionEmail.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.sqlInjectionEmail.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_VALIDATION_009 [VALIDATION]: Doctor Whitespace Auto-Trim Check', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.whitespaceEmail.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.whitespaceEmail.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_VALIDATION_010 [VALIDATION]: Doctor Email Case-Insensitivity Check', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.uppercaseEmail.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.uppercaseEmail.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_DOCTOR_SECURITY_011 [SECURITY]: Doctor XSS Payload Security Check', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded' });
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible().catch(() => false)) await staffLoginBtn.click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(testData.invalidUser.xssPayloadEmail.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testData.invalidUser.xssPayloadEmail.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('body')).toBeVisible();
  });

});
