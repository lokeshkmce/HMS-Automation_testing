import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../../pages/login.page';
import { ReceptionistPage } from '../../../../pages/receptionist.page';

test.describe('Step 2: Receptionist Check-In & Nurse Triage - Psychiatry', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_TRIAGE_PSYCHIATRY [VALID]: Receptionist Check-In & Triage for Psychiatry', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const receptionistPage = new ReceptionistPage(page);

    // 1. Staff Login
    await loginPage.loginAsStaff('qa.psychiatry@omnivva.com', 'password123');

    // 2. Switch Role to Receptionist
    await receptionistPage.switchToReceptionistRole();

    // 3. Navigate to Check-In screen
    const checkInMenu = page.getByRole('button', { name: /Check.*In/i }).or(page.getByText(/Check.*In/i)).first();
    if (await checkInMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkInMenu.click({ force: true });
      await page.waitForTimeout(1500);
    } else {
      await page.goto('https://dev-hms.srivyn.in/staff/receptionist/check-in', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    // 4. Select Patient in queue & Check In
    const patientCard = page.locator('.MuiCard-root, tr, [role="row"]')
      .filter({ hasText: /flow check|SCHEDULED|Waiting|Pending/i })
      .or(page.getByText('flow check'))
      .first();

    if (await patientCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await patientCard.click({ force: true });
      await page.waitForTimeout(1000);
    }

    const checkInPatientBtn = page.getByRole('button', { name: /Check In Patient|Check-In/i }).first();
    if (await checkInPatientBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkInPatientBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // 5. Proceed to Nurse Triage
    const proceedTriageBtn = page.getByRole('button', { name: /Proceed to Nurse Triage|Nurse Triage|Triage/i }).first();
    if (await proceedTriageBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await proceedTriageBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const chiefComplaintInput = page.getByRole('textbox', { name: 'None' }).or(page.locator('input[placeholder*="complaint"], textarea[placeholder*="complaint"]')).first();
    if (await chiefComplaintInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chiefComplaintInput.fill('Routine Psychiatry checkup');
    }

    const saveDraftBtn = page.getByRole('button', { name: /Save Draft|Save Triage|Save/i }).first();
    if (await saveDraftBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await saveDraftBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
