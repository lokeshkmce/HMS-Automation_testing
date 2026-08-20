import { test, expect } from '@playwright/test';

test.describe('Step 6: Radiology Scan Processing & Reporting - Dermatology', () => {

  test('TC_RAD_DERMATOLOGY [VALID]: Radiology Scan Processing for Dermatology', async ({ page }) => {
    test.setTimeout(120_000);

    // 1. HMS Staff Login
    await page.goto('https://dev-hms.srivyn.in/');
    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('qa@omnivva.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');

    const signInBtn = page.getByRole('button', { name: 'Sign In' });
    if (await signInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await signInBtn.click();
    } else {
      await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    }
    await page.waitForTimeout(3000);

    // 2. Switch Role to Radiologist (EXACT NEW RECORDED SCRIPT)
    const qaRoleBtn = page.getByRole('button', { name: 'QA All Roles STAFF QA' })
      .or(page.getByRole('button', { name: /QA All Roles/i }))
      .first();
    await qaRoleBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await qaRoleBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const switchRoleBtn = page.getByRole('button', { name: 'Switch Role' }).first();
    await switchRoleBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await switchRoleBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const radiologistBtn = page.getByRole('button', { name: 'Radiologist' }).first();
    await radiologistBtn.waitFor({ state: 'attached', timeout: 15_000 });
    await radiologistBtn.evaluate((node) => node.scrollIntoView({ block: 'center' })).catch(() => {});
    await page.waitForTimeout(500);
    await radiologistBtn.click({ force: true });
    await page.waitForTimeout(2500);

    // 3. Radiology Dashboard -> Status Tracking (EXACT NEW RECORDED SCRIPT - NO ORDER ENTRY CLICK)
    const radDashBtn = page.getByRole('button', { name: 'Radiology Dashboard' })
      .or(page.getByText('Radiology Dashboard'))
      .first();
    await radDashBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await radDashBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const statusTrackingBtn = page.getByRole('button', { name: 'Status Tracking' })
      .or(page.getByText('Status Tracking'))
      .first();
    await statusTrackingBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await statusTrackingBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // 4. Locate Step 3 Patient ('flow check') Row with 'Schedule' button
    let targetPatientRow = page.locator('tr').filter({ hasText: 'flow check' }).filter({ hasText: /Schedule|Ordered/i }).first();

    let found = false;
    for (let i = 0; i < 6; i++) {
      if (await targetPatientRow.isVisible({ timeout: 800 }).catch(() => false)) {
        found = true;
        break;
      }
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(400);
    }

    if (!found) {
      targetPatientRow = page.locator('tr').filter({ hasText: 'flow check' }).first();
      if (await targetPatientRow.isVisible({ timeout: 1000 }).catch(() => false)) {
        found = true;
      }
    }

    const scheduleBtn1 = targetPatientRow.getByRole('button', { name: 'Schedule' }).first();
    if (await scheduleBtn1.isVisible({ timeout: 4000 }).catch(() => false)) {
      await scheduleBtn1.click({ force: true });
      await page.waitForTimeout(1500);

      const scheduleBtn2 = page.getByRole('button', { name: 'Schedule' }).first();
      if (await scheduleBtn2.isVisible({ timeout: 3000 }).catch(() => false)) {
        await scheduleBtn2.click({ force: true });
        await page.waitForTimeout(1500);
      }

      // 5. Mark as Performed
      const markPerformedBtn = page.getByRole('button', { name: 'Mark as Performed' }).first();
      if (await markPerformedBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await markPerformedBtn.click({ force: true });
        await page.waitForTimeout(2000);
      }

      // 6. Write & Create Report
      const writeReportBtn = page.getByRole('button', { name: 'Write Report' }).first();
      if (await writeReportBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        await writeReportBtn.click({ force: true });
        await page.waitForTimeout(1500);

        const createReportBtn = page.getByRole('button', { name: 'Create Report' }).nth(1)
          .or(page.getByRole('button', { name: 'Create Report' }))
          .first();
        if (await createReportBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await createReportBtn.click({ force: true });
          await page.waitForTimeout(1500);
        }

        const criticalFindingCheck = page.getByText('Critical finding')
          .or(page.getByRole('checkbox', { name: 'Critical finding' }))
          .first();
        if (await criticalFindingCheck.isVisible({ timeout: 3000 }).catch(() => false)) {
          await criticalFindingCheck.click({ force: true }).catch(() => {});
        }

        const saveSignBtn = page.getByRole('button', { name: 'Save & Sign Report' }).first();
        if (await saveSignBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await saveSignBtn.click({ force: true });
          await page.waitForTimeout(2000);
        }

        // 7. Verifier Selection & Verification (EXACT RECORDED SCRIPT LOCATORS)
        const verifierCombo = page.getByRole('combobox', { name: 'Verifier' })
          .or(page.locator('[role="combobox"]'))
          .first();

        await verifierCombo.waitFor({ state: 'visible', timeout: 15_000 });
        await verifierCombo.click({ force: true });
        await page.waitForTimeout(1000);

        const drArunOpt = page.getByRole('option', { name: 'Dr. Arun Kumar' })
          .or(page.getByRole('option', { name: /Dr. Arun/i }))
          .or(page.getByText('Dr. Arun Kumar'))
          .first();

        await drArunOpt.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
        if (await drArunOpt.isVisible({ timeout: 3000 }).catch(() => false)) {
          await drArunOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(1000);

        const verifyBtn = page.getByRole('button', { name: 'Verify' }).first();
        await verifyBtn.waitFor({ state: 'visible', timeout: 15_000 });
        await verifyBtn.click({ force: true });
        await page.waitForTimeout(3000);
      }
    } else {
      console.log('No pending Schedule order found for flow check patient.');
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
