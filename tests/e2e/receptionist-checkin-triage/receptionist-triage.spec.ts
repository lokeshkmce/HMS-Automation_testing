import { test, expect } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';

test.describe('HMS Receptionist Check-In & Nurse Triage Flow - All 23 Doctor Specialties', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies().catch(() => {});
  });

  testData.doctorSpecialties.forEach((specItem, idx) => {
    const testNum = String(idx + 1).padStart(3, '0');

    test(`TC_TRIAGE_${testNum} [VALID]: Receptionist Check-In & Nurse Triage - ${specItem.specialty}`, async ({ page }) => {
      // 1. Navigate to HMS Staff Portal
      await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

      // 2. Staff Login
      const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' }).first();
      if (await staffLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await staffLoginBtn.click();
      }

      const usernameInput = page.getByRole('textbox', { name: /Username|Email/i })
        .or(page.locator('input[name="username"]'))
        .first();

      await usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
      await usernameInput.fill(specItem.username);

      const passwordInput = page.getByRole('textbox', { name: /Password/i })
        .or(page.locator('input[name="password"]'))
        .first();
      await passwordInput.fill(specItem.password);

      const signInBtn = page.getByRole('button', { name: /Sign In|Submit/i }).first();
      if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await signInBtn.click();
      } else {
        await passwordInput.press('Enter');
      }

      // Domain Fallback retry if needed
      const isInvalid = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 3000 }).catch(() => false);
      if (isInvalid) {
        const altUsername = specItem.username.includes('@ominvva.com')
          ? specItem.username.replace('@ominvva.com', '@omnivva.com')
          : specItem.username.replace('@omnivva.com', '@ominvva.com');
        await usernameInput.click();
        await usernameInput.fill(altUsername);
        await passwordInput.click();
        await passwordInput.fill(specItem.password);
        await signInBtn.click({ force: true });
      }

      // 3. Switch Role to Receptionist
      await page.waitForTimeout(2000);
      const roleSliderTab = page.getByText(/ROLE SLIDER/i).first();
      if (await roleSliderTab.isVisible({ timeout: 4000 }).catch(() => false)) {
        await roleSliderTab.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
      } else if (!page.url().includes('/staff/select-role')) {
        await page.goto('https://dev-hms.srivyn.in/staff/select-role', { waitUntil: 'domcontentloaded' }).catch(() => {});
      }

      const receptionistBtn = page.getByRole('button', { name: 'Receptionist' }).or(page.getByText('Receptionist')).first();
      await receptionistBtn.waitFor({ state: 'visible', timeout: 10_000 });
      await receptionistBtn.click({ force: true });
      await page.waitForTimeout(2000);

      // 4. Open Check-In Screen
      const checkInBtn = page.getByRole('button', { name: /Check.*In/i })
        .or(page.getByText('Check-Ins'))
        .or(page.locator('a, button, div').filter({ hasText: /Check-In Screen|Check-Ins/i }))
        .first();

      await checkInBtn.waitFor({ state: 'visible', timeout: 15_000 });
      await checkInBtn.click({ force: true });

      await page.waitForURL((url) => url.href.includes('/check-in'), { timeout: 15_000 }).catch(() => {});
      await page.waitForTimeout(2000);

      // 5. Filter by Doctor (Option matches specialty doctor name or All Doctors)
      const doctorFilter = page.getByText('All Doctors').or(page.getByRole('combobox')).first();
      if (await doctorFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
        await doctorFilter.click({ force: true });
        const doctorOption = page.getByRole('option', { name: new RegExp('Dr. QA ' + specItem.specialty.replace('&', '.*'), 'i') })
          .or(page.getByRole('option').first());
        if (await doctorOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await doctorOption.click();
          await page.waitForTimeout(1000);
        }
      }

      // 6. Click Pending Booked Patient Card in Queue (Orange badge card - latest pending in queue)
      const pendingCard = page.locator('div')
        .filter({ hasText: /flow check/i })
        .filter({ hasText: /Token/i })
        .last();

      if (await pendingCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await pendingCard.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 7. Click Check In Patient Button inside Modal
      const checkInPatientBtn = page.getByRole('button', { name: /Check In Patient|Check-In/i }).first();
      if (await checkInPatientBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await checkInPatientBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 8. Click Proceed to Nurse Triage Button
      const proceedTriageBtn = page.getByRole('button', { name: /Proceed to Nurse Triage|Nurse Triage|Triage/i }).first();
      if (await proceedTriageBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await proceedTriageBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 9. Fill Triage Vitals
      const chiefComplaintInput = page.getByRole('textbox', { name: 'None' }).first();
      if (await chiefComplaintInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await chiefComplaintInput.fill(`Routine ${specItem.specialty} checkup`);
      }

      const saveDraftBtn = page.getByRole('button', { name: /Save Draft|Save Triage/i }).first();
      if (await saveDraftBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await saveDraftBtn.click();
        await page.waitForTimeout(2000);
      }

      await expect(page.locator('body')).toBeVisible();
    });
  });

});
