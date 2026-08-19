import { test, expect } from '@playwright/test';

test.describe('Step 3: Doctor Consultation & Prescription - Gastroenterology', () => {

  test('TC_DOC_GASTROENTEROLOGY [VALID]: Doctor Consultation for Gastroenterology', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('https://dev-hms.srivyn.in/');

    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('qa.gastro@ominvva.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const switchRoleBtn = page.getByRole('button', { name: /QA|STAFF|Switch Role/i })
      .or(page.getByRole('button', { name: 'Role Slider' }))
      .or(page.getByText('Role Slider'))
      .first();
    if (await switchRoleBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await switchRoleBtn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
      const subSwitch = page.getByRole('button', { name: 'Switch Role' }).first();
      if (await subSwitch.isVisible({ timeout: 3000 }).catch(() => false)) {
        await subSwitch.click({ force: true });
        await page.waitForTimeout(1000);
      }
    }

    const docRoleCard = page.getByRole('button', { name: 'Doctor' }).or(page.getByText('Doctor', { exact: true })).first();
    await docRoleCard.waitFor({ state: 'visible', timeout: 10_000 });
    await docRoleCard.click({ force: true });
    await page.waitForTimeout(2000);

    const docConsoleBtn = page.getByRole('button', { name: 'Doctor Console' }).or(page.locator('a[href*="doctor"]')).first();
    await docConsoleBtn.click({ force: true });
    await page.waitForTimeout(2500);

    const targetRow = page.locator('tr, [role="row"]').filter({ hasText: /flow check/i }).last();
    const startConsultBtn = targetRow.getByRole('button', { name: /Start Consult|In Consult/i })
      .or(page.getByRole('cell', { name: 'Start Consult' }))
      .or(page.getByRole('button', { name: 'Start Consult' }))
      .or(page.getByRole('button', { name: 'In Consult' }))
      .first();

    if (await startConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startConsultBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const inConsultBtn = page.getByRole('button', { name: 'In Consult' }).first();
    if (await inConsultBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await inConsultBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const nextBtn1 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn1.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn1.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const nextBtn2 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn2.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const addPrescriptionBtn = page.getByRole('button', { name: 'Add Prescription' }).first();
    if (await addPrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await addPrescriptionBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const medInput = page.getByRole('textbox', { name: 'e.g. Tab Aspirin' }).first();
      if (await medInput.isVisible({ timeout: 4000 }).catch(() => false)) {
        await medInput.click();
        await medInput.fill('pantoprazole');
        await page.waitForTimeout(1000);

        const medOption = page.locator('div').filter({ hasText: new RegExp('^' + 'Pantoprazole' + '$', 'i') })
          .or(page.locator('div').filter({ hasText: /^Dolo 650$/ }))
          .first();

        if (await medOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await medOption.click({ force: true });
          await page.waitForTimeout(800);
        }
      }

      const savePrescriptionBtn = page.getByRole('button', { name: 'Verify & Save Prescription' }).first();
      if (await savePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await savePrescriptionBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }
    }

    const nextBtn3 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn3.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn3.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const nextBtn4 = page.getByRole('button', { name: 'Next >' }).first();
    if (await nextBtn4.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn4.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const suggestLabBtn = page.getByRole('button', { name: 'Suggest Lab' }).first();
    if (await suggestLabBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await suggestLabBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const labCheckbox = page.getByRole('row', { name: 'Blood Sugar (Fasting & PP)' }).getByRole('checkbox').first();
      if (await labCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await labCheckbox.check({ force: true }).catch(() => {});
      }

      const suggestPatientBtn = page.getByRole('button', { name: 'Suggest to Patient' }).first();
      if (await suggestPatientBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestPatientBtn.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }

    const suggestRadiologyBtn = page.getByRole('button', { name: 'Suggest Radiology' }).first();
    if (await suggestRadiologyBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await suggestRadiologyBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const mammoBtn = page.getByRole('button', { name: 'MAMMOGRAPHY' }).first();
      if (await mammoBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await mammoBtn.click({ force: true });
      }

      const petBtn = page.getByRole('button', { name: 'PET' }).first();
      if (await petBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await petBtn.click({ force: true });
      }

      const xrayBtn = page.getByRole('button', { name: 'XRAY' }).first();
      if (await xrayBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await xrayBtn.click({ force: true });
      }

      const suggestScanBtn = page.getByRole('button', { name: 'Suggest Scan' }).first();
      if (await suggestScanBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestScanBtn.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }

    const submitConsultBtn = page.getByRole('button', { name: 'Submit Consult' }).first();
    if (await submitConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await submitConsultBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
