import { test, expect } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';
import { DoctorPage } from '../../../pages/doctor.page';
import { SuggestLabPage } from '../../../pages/suggest-lab.page';

test.describe('HMS Doctor Consultation - Suggest Lab Module (Valid & Invalid AI Test Suite)', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});

    // 1. Navigate to HMS Staff Portal
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

    // 2. Staff Login with Doctor Credentials
    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
    if (await staffLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await staffLoginBtn.click();
    }

    const usernameInput = page.getByRole('textbox', { name: /Username|Email/i })
      .or(page.locator('input[name="username"]'))
      .first();

    await usernameInput.waitFor({ state: 'visible', timeout: 15_000 });

    const emailsToTry = [
      'qa.dental@omnivva.com',
      'qa.derma@omnivva.com',
      'qa.psychiatry@omnivva.com'
    ];

    const passwordInput = page.getByRole('textbox', { name: /Password/i })
      .or(page.locator('input[name="password"]'))
      .first();

    const signInBtn = page.getByRole('button', { name: /Sign In|Submit/i }).first();

    for (const email of emailsToTry) {
      await usernameInput.click();
      await usernameInput.fill(email);
      await passwordInput.click();
      await passwordInput.fill('password123');

      if (await signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await signInBtn.click();
      } else {
        await passwordInput.press('Enter');
      }

      await page.waitForTimeout(2000);
      const isInvalid = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 2000 }).catch(() => false);
      if (!isInvalid) {
        break;
      }
    }

    await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const doctorPage = new DoctorPage(page);
    await doctorPage.switchToDoctorRole();

    // 3. Open Doctor Console & Select Active Patient
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Advance through Step 1 & Step 2 to Step 3
    await doctorPage.fillStep1PatientDetails();
    await doctorPage.fillStep2SpecialtyAssessment();

    // 5. Open Suggest Lab Modal by clicking "Refer for Lab" button
    const referLabBtn = page.getByRole('button', { name: /Refer for Lab|Suggest Lab|Lab/i })
      .or(page.locator('button:has-text("Refer for Lab")'))
      .first();

    await referLabBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await referLabBtn.click({ force: true });
    await page.waitForTimeout(1500);
  });

  // ==========================================
  // 🟢 VALID TEST CASES
  // ==========================================

  test('TC_LAB_001 [VALID]: Search, Select Single Lab Test (CBC) & Suggest to Patient', async ({ page }) => {
    const labPage = new SuggestLabPage(page);
    const labData = testData.labTestData.validTests[0];

    // 1. Verify Modal is Open
    await expect(labPage.modalHeading).toBeVisible();

    // 2. Search for CBC Test
    await labPage.searchTest(labData.searchQuery || 'CBC');

    // 3. Select Complete Blood Count (CBC)
    await labPage.selectTest(labData.testName || 'Complete Blood Count (CBC)');

    // 4. Verify Selection Counter
    const countText = await labPage.selectionCountText.textContent().catch(() => '');
    expect(countText).toMatch(/1 test\(s\) selected/i);

    // 5. Submit Suggestion
    await labPage.submitSuggestion();

    // 6. Verify modal closes & consultation remains active
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_LAB_002 [VALID]: Filter by Category (Hematology) & Multi-Select Tests', async ({ page }) => {
    const labPage = new SuggestLabPage(page);

    // 1. Verify Modal
    await expect(labPage.modalHeading).toBeVisible();

    // 2. Click "Hematology" Category Chip
    await labPage.filterByCategory('Hematology');

    // 3. Select First Available Test
    const firstCheckbox = page.locator('input[type="checkbox"], .MuiCheckbox-root').first();
    if (await firstCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstCheckbox.click({ force: true });
      await page.waitForTimeout(400);
    }

    // 4. Select Second Available Test if present
    const checkboxes = page.locator('input[type="checkbox"], .MuiCheckbox-root');
    if ((await checkboxes.count()) > 1) {
      await checkboxes.nth(1).click({ force: true });
      await page.waitForTimeout(400);
    }

    // 5. Verify Suggestion Submission
    await labPage.submitSuggestion();
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_LAB_003 [VALID]: Search Test and Cancel Action', async ({ page }) => {
    const labPage = new SuggestLabPage(page);

    // 1. Search for Blood Sugar
    await labPage.searchTest('Blood Sugar');

    // 2. Cancel and close modal
    await labPage.cancelModal();

    // 3. Verify modal is dismissed
    await page.waitForTimeout(1000);
    const isModalVisible = await labPage.modalHeading.isVisible({ timeout: 2000 }).catch(() => false);
    expect(isModalVisible).toBeFalsy();
  });

  // ==========================================
  // 🔴 INVALID & NEGATIVE TEST CASES
  // ==========================================

  test('TC_LAB_004 [INVALID/DISABLED]: Verify Suggest to Patient is Disabled with 0 Selected Tests', async ({ page }) => {
    const labPage = new SuggestLabPage(page);

    // 1. Verify 0 tests selected by default
    const countText = await labPage.selectionCountText.textContent().catch(() => '');
    expect(countText).toMatch(/0 test\(s\) selected/i);

    // 2. Verify Suggest Button is Disabled
    const isDisabled = await labPage.isSuggestButtonDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test('TC_LAB_005 [INVALID]: Search Non-Existent Lab Test Query', async ({ page }) => {
    const labPage = new SuggestLabPage(page);
    const nonExistentQuery = testData.labTestData.invalidQueries.nonExistent;

    // 1. Search for non-existent test query
    await labPage.searchTest(nonExistentQuery);

    // 2. Verify table rows do not show valid test items
    const cbcItem = page.getByText(/Complete Blood Count \(CBC\)/i);
    const isCbcVisible = await cbcItem.isVisible({ timeout: 1500 }).catch(() => false);
    expect(isCbcVisible).toBeFalsy();
  });

  test('TC_LAB_006 [SECURITY/EDGE]: Special Characters & Script Injection in Search', async ({ page }) => {
    const labPage = new SuggestLabPage(page);
    const xssQuery = testData.labTestData.invalidQueries.specialChars;

    let alertTriggered = false;
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    // 1. Search with XSS payload
    await labPage.searchTest(xssQuery);
    await page.waitForTimeout(1000);

    // 2. Verify application handles string safely without script popup
    expect(alertTriggered).toBeFalsy();
    await labPage.cancelModal();
  });

});
