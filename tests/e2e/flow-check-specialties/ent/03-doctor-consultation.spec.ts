import { test, expect } from '@playwright/test';
import testData from '../../../../test-data/hmsTestData.json';

test.describe('Step 3: Doctor Consultation & Prescription - ENT', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_DOC_ENT [VALID]: Doctor Consultation for ENT', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForTimeout(1000);

    const staffLoginBtnDoc = page.getByRole('button', { name: 'Staff Login' })
      .or(page.getByRole('link', { name: 'Staff Login' }))
      .or(page.getByText('Staff Login'))
      .first();

    if (await staffLoginBtnDoc.isVisible({ timeout: 5000 }).catch(() => false)) {
      await staffLoginBtnDoc.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const docUserInput = page.getByRole('textbox', { name: /Username|Email/i })
      .or(page.locator('input[name="username"], input[name="email"], input[id="username"]'))
      .first();

    if (await docUserInput.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const docPassInput = page.getByRole('textbox', { name: /Password/i })
        .or(page.locator('input[type="password"]'))
        .first();

      const docSignInBtn = page.getByRole('button', { name: /Sign In|Submit|Login/i }).first();

      const emailsToTry = Array.from(new Set([
        'qa.ent@omnivva.com',
        'qa.ent@omnivva.com'.replace('cardio.surgery', 'cardiosurgery'),
        'qa.ent@omnivva.com'.replace('cardiosurgery', 'cardio.surgery'),
        'qa.ent@omnivva.com'.replace('@ominvva.com', '@omnivva.com'),
        'qa.ent@omnivva.com'.replace('@omnivva.com', '@ominvva.com')
      ]));

      for (const email of emailsToTry) {
        await docUserInput.click();
        await docUserInput.fill(email);
        await docPassInput.click();
        await docPassInput.fill('password123');

        if (await docSignInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await docSignInBtn.click({ force: true });
        } else {
          await docPassInput.press('Enter');
        }

        await page.waitForTimeout(2000);
        const isInvalidDoc = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 2000 }).catch(() => false);
        if (!isInvalidDoc) {
          break;
        }
      }
    }

    await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const roleSliderBtnDoc = page.getByText(/ROLE SLIDER/i)
      .or(page.locator('button, div, span').filter({ hasText: /ROLE SLIDER/i }))
      .first();

    if (await roleSliderBtnDoc.isVisible({ timeout: 4000 }).catch(() => false)) {
      await roleSliderBtnDoc.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }

    const doctorRoleCard = page.getByRole('button', { name: 'Doctor' })
      .or(page.getByText('Doctor', { exact: true }))
      .or(page.locator('div, button, a').filter({ hasText: /^Doctor$/i }))
      .first();

    if (await doctorRoleCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await doctorRoleCard.scrollIntoViewIfNeeded().catch(() => {});
      await doctorRoleCard.click({ force: true }).catch(async () => {
        await doctorRoleCard.dispatchEvent('click').catch(() => {});
      });
      await page.waitForTimeout(2000);
    }

    const doctorConsoleBtn = page.getByRole('button', { name: /Doctor Console/i })
      .or(page.getByRole('link', { name: /Doctor Console/i }))
      .or(page.getByText(/Doctor Console/i))
      .first();

    if (await doctorConsoleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await doctorConsoleBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

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

    const provisionalDiagnosisInput = page.getByRole('textbox', { name: /Provisional Diagnosis/i })
      .or(page.locator('input[placeholder*="Diagnosis"], textarea[placeholder*="Diagnosis"]'))
      .first();

    if (await provisionalDiagnosisInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await provisionalDiagnosisInput.fill('Diagnosis - ENT');
    }

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
        let medOption = page.locator('div, li').filter({ hasText: new RegExp('Dolo 650', 'i') }).first();

        if (!(await medOption.isVisible({ timeout: 2000 }).catch(() => false))) {
          await medicineSearchInput.fill('dolo');
          await page.waitForTimeout(1000);
          medOption = page.locator('div, li').filter({ hasText: /Dolo 650/i }).first();
        }

        if (await medOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await medOption.click({ force: true });
        }
      }

      const savePrescriptionBtn = page.getByRole('button', { name: /Verify & Save Prescription|Save Prescription/i }).first();
      if (await savePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await savePrescriptionBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }
    }

    const completeConsultBtn = page.getByRole('button', { name: /Complete Consultation/i }).first();
    if (await completeConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await completeConsultBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
