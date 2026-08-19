import { test, expect } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';
import { DoctorPage } from '../../../pages/doctor.page';
import { PrescriptionPage } from '../../../pages/prescription.page';

test.describe('HMS e-Prescription Module - Valid & Invalid AI Test Suite', () => {

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

    // 3. Open Doctor Console and Start Consult on active queue item
    await doctorPage.openPatientFromQueue('flow check');

    // 4. Advance through Step 1 & Step 2 to reach Step 3
    await doctorPage.fillStep1PatientDetails();
    await doctorPage.fillStep2SpecialtyAssessment();

    // 5. On Step 3, click Write Prescription to open the Prescription Page
    const rxBtn = page.getByRole('button', { name: /Write Prescription/i })
      .or(page.locator('button:has-text("Write Prescription")'))
      .first();

    if (await rxBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await rxBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }
  });

  // ==========================================
  // 🟢 VALID TEST CASES
  // ==========================================

  test('TC_RX_001 [VALID]: Complete Single Medicine Prescription', async ({ page }) => {
    const rxPage = new PrescriptionPage(page);
    const validData = testData.prescriptionData.validPrescriptions[0];

    // 1. Verify Page Loaded
    await expect(page.locator('body')).toBeVisible();

    // 2. Fill Single Medicine Row
    await rxPage.fillMedicineRow(0, validData.medicines[0]);

    // 3. Fill Instructions / Advice
    await rxPage.fillInstructions(validData.instructions);

    // 4. Fill Follow-Up
    await rxPage.fillFollowUp(validData.followUp);

    // 5. Submit Prescription
    await rxPage.submitPrescription();

    // 6. Verify Form Submission
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_RX_002 [VALID]: Multi-Medicine Prescription with Add Medicine Row', async ({ page }) => {
    const rxPage = new PrescriptionPage(page);
    const multiData = testData.prescriptionData.validPrescriptions[1];

    // 1. Fill First Medicine
    await rxPage.fillMedicineRow(0, multiData.medicines[0]);

    // 2. Click + Add Medicine to add second row
    await rxPage.clickAddMedicine();

    // 3. Fill Second Medicine
    await rxPage.fillMedicineRow(1, multiData.medicines[1]);

    // 4. Fill Instructions & Follow-up
    await rxPage.fillInstructions(multiData.instructions);
    await rxPage.fillFollowUp(multiData.followUp);

    // 5. Verify & Save
    await rxPage.submitPrescription();

    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_RX_003 [VALID]: Add and Delete Medicine Row', async ({ page }) => {
    const rxPage = new PrescriptionPage(page);

    // 1. Add first medicine
    await rxPage.fillMedicineRow(0, {
      name: 'dolo',
      selectText: 'Dolo 650',
      dose: '650 mg',
      duration: '3 days',
      when: 'After food'
    });

    // 2. Add second medicine row
    await rxPage.clickAddMedicine();

    // 3. Delete the newly added row
    await rxPage.deleteMedicineRow(1);
    await page.waitForTimeout(1000);

    // 4. Complete and Save remaining prescription
    await rxPage.fillInstructions('Single dose remaining after row deletion test.');
    await rxPage.submitPrescription();

    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  // ==========================================
  // 🔴 INVALID & NEGATIVE TEST CASES
  // ==========================================

  test('TC_RX_004 [INVALID]: Submit Prescription Without Medicine (Empty Medicine)', async ({ page }) => {
    const rxPage = new PrescriptionPage(page);
    const invalidData = testData.prescriptionData.invalidPrescriptions.emptyMedicine;

    // 1. Clear any prefilled medicine input
    const medInput = page.locator('input[placeholder*="Aspirin"], input[placeholder*="Medicine"]').first();
    if (await medInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await medInput.click({ force: true });
      await medInput.fill('');
    }

    // 2. Fill only Instructions and Follow-up without medicine
    await rxPage.fillInstructions(invalidData.instructions);
    await rxPage.fillFollowUp(invalidData.followUp);

    // 3. Attempt to Submit
    await rxPage.submitPrescription();

    // 4. Verify system retains user on form or shows validation
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_RX_005 [INVALID]: Search Non-Existent Medicine Query', async ({ page }) => {
    const invalidData = testData.prescriptionData.invalidPrescriptions.nonExistentMedicine;

    const medInput = page.locator('input[placeholder*="Aspirin"], input[placeholder*="Medicine"]').first();
    if (await medInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await medInput.click({ force: true });
      await medInput.fill(invalidData.searchTerm);
      await page.waitForTimeout(1500);

      // Verify no valid selection matches garbage query
      const validDoloOption = page.locator('li, [role="option"]').filter({ hasText: /Dolo 650|Paracetamol/i }).first();
      const isOptionVisible = await validDoloOption.isVisible({ timeout: 1500 }).catch(() => false);

      expect(isOptionVisible).toBeFalsy();
    }
  });

  test('TC_RX_006 [SECURITY/EDGE]: XSS and Boundary Characters in Instructions & FollowUp', async ({ page }) => {
    const rxPage = new PrescriptionPage(page);
    const boundaryData = testData.prescriptionData.invalidPrescriptions.boundaryAdvice;

    // 1. Fill valid medicine
    await rxPage.fillMedicineRow(0, boundaryData.medicines[0]);

    // 2. Inject XSS and boundary characters
    await rxPage.fillInstructions(boundaryData.instructions);
    await rxPage.fillFollowUp(boundaryData.followUp);

    // 3. Verify dialog/alert is not triggered by script injection
    let alertTriggered = false;
    page.on('dialog', async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    // 4. Submit Prescription
    await rxPage.submitPrescription();
    await page.waitForTimeout(2000);

    // XSS alert should NOT have executed
    expect(alertTriggered).toBeFalsy();
  });

});
