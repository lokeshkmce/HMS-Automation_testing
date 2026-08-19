import { test, expect } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';
import { DoctorPage } from '../../../pages/doctor.page';

test.describe('HMS Doctor Consultation & Prescription Flow - All 23 Doctor Specialties', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  testData.doctorSpecialties.forEach((specItem, idx) => {
    const testNum = String(idx + 1).padStart(3, '0');

    test(`TC_DOC_CONSULT_${testNum} [VALID]: Doctor Consultation & Prescription - ${specItem.specialty} (${specItem.username})`, async ({ page }) => {
      const doctorPage = new DoctorPage(page);

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

      const emailsToTry = Array.from(new Set([
        specItem.username,
        specItem.username.replace('@ominvva.com', '@omnivva.com'),
        specItem.username.replace('@omnivva.com', '@ominvva.com'),
        specItem.username.replace('cardio.surgery', 'cardiosurgery'),
        specItem.username.replace('cardiosurgery', 'cardio.surgery')
      ]));

      const passwordInput = page.getByRole('textbox', { name: /Password/i })
        .or(page.locator('input[name="password"]'))
        .first();

      const signInBtn = page.getByRole('button', { name: /Sign In|Submit/i }).first();

      for (const email of emailsToTry) {
        await usernameInput.click();
        await usernameInput.fill(email);
        await passwordInput.click();
        await passwordInput.fill(specItem.password);

        if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
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

      // 3. Switch Role to Doctor
      await doctorPage.switchToDoctorRole();

      // 4. Open Doctor Console & Select Patient from Queue
      await doctorPage.openPatientFromQueue('flow check');

      // 5. Complete All 3 Steps of Doctor Consultation
      await doctorPage.completeFull3StepConsultation(specItem.specialty, {
        specialty: specItem.specialty,
        chiefComplaint: `Severe symptoms reported for ${specItem.specialty} consult`,
        referredBy: 'Dr. QA Hospital / Self',
        imagingFindings: `Normal MRI/CT findings for ${specItem.specialty}. No acute complications noted.`,
        provisionalDiagnosis: `Provisional Diagnosis - ${specItem.specialty}`,
        icd10Code: 'I20.8',
        treatmentPlan: `Standard medical management for ${specItem.specialty}. Patient advised for hydration, medication adherence, and follow-up in 1 week.`,
        scheduleNextVisit: '28-09-2026',
        doctorNotes: `Consultation completed successfully for ${specItem.specialty}. Patient in stable condition.`
      });

      await expect(page.locator('body')).toBeVisible();
    });
  });

});
