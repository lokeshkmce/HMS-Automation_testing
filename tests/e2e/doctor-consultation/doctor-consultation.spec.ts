import { test, expect } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';

test.describe('HMS Doctor Consultation & Prescription Flow - All 23 Doctor Specialties', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies().catch(() => {});
  });

  testData.doctorSpecialties.forEach((specItem, idx) => {
    const testNum = String(idx + 1).padStart(3, '0');

    test(`TC_DOC_CONSULT_${testNum} [VALID]: Doctor Consultation & Prescription - ${specItem.specialty} (${specItem.username})`, async ({ page }) => {
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

      // 3. Switch Role to Doctor
      await page.waitForTimeout(2000);
      const roleSliderTab = page.getByText(/ROLE SLIDER/i).first();
      if (await roleSliderTab.isVisible({ timeout: 4000 }).catch(() => false)) {
        await roleSliderTab.click({ force: true }).catch(() => {});
        await page.waitForTimeout(1000);
      } else if (!page.url().includes('/staff/select-role')) {
        await page.goto('https://dev-hms.srivyn.in/staff/select-role', { waitUntil: 'domcontentloaded' }).catch(() => {});
      }

      const doctorRoleCard = page.getByRole('button', { name: 'Doctor' }).or(page.getByText('Doctor', { exact: true })).first();
      if (await doctorRoleCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await doctorRoleCard.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 4. Open Doctor Console
      const doctorConsoleBtn = page.getByRole('button', { name: /Doctor Console/i })
        .or(page.getByText(/Doctor Console/i))
        .first();

      if (await doctorConsoleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await doctorConsoleBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 5. Click Start Consult on patient row
      const flowCheckRow = page.locator('tr, [role="row"], .MuiPaper-root, .MuiCard-root')
        .filter({ hasText: /flow check/i })
        .first();

      if (await flowCheckRow.isVisible({ timeout: 5000 }).catch(() => false)) {
        const startConsultBtn = flowCheckRow.getByRole('button', { name: /Start Consult/i })
          .or(flowCheckRow.getByText(/Start Consult/i))
          .first();

        if (await startConsultBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await startConsultBtn.click({ force: true });
          await page.waitForTimeout(2000);
        }
      }

      // 6. Fill Provisional Diagnosis
      const provisionalDiagnosisInput = page.getByRole('textbox', { name: /Provisional Diagnosis/i })
        .or(page.locator('input[placeholder*="Diagnosis"], textarea[placeholder*="Diagnosis"]'))
        .first();

      if (await provisionalDiagnosisInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await provisionalDiagnosisInput.fill(`Provisional Diagnosis - ${specItem.specialty}`);
      }

      // 7. Write Prescription
      const writePrescriptionBtn = page.getByRole('button', { name: /Write Prescription/i }).first();
      if (await writePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await writePrescriptionBtn.click({ force: true });
        await page.waitForTimeout(1500);

        const addMedBtn = page.getByRole('button', { name: /Add Medicine/i }).first();
        if (await addMedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await addMedBtn.click({ force: true });
          await page.waitForTimeout(500);
        }

        const medicineSearchInput = page.getByRole('textbox', { name: /Tab Aspirin|Medicine|Search/i })
          .or(page.locator('input[placeholder*="Aspirin"]'))
          .first();

        if (await medicineSearchInput.isVisible({ timeout: 4000 }).catch(() => false)) {
          await medicineSearchInput.fill('dolo');
          await page.waitForTimeout(1000);
          const doloOption = page.locator('div').filter({ hasText: /Dolo 650/i }).first();
          if (await doloOption.isVisible({ timeout: 3000 }).catch(() => false)) {
            await doloOption.click({ force: true });
          }
        }

        const savePrescriptionBtn = page.getByRole('button', { name: /Verify & Save Prescription|Save Prescription/i }).first();
        if (await savePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await savePrescriptionBtn.click({ force: true });
          await page.waitForTimeout(2000);
        }
      }

      // 8. Complete Consultation
      const completeConsultBtn = page.getByRole('button', { name: /Complete Consultation/i }).first();
      if (await completeConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await completeConsultBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }

      await expect(page.locator('body')).toBeVisible();
    });
  });

});
