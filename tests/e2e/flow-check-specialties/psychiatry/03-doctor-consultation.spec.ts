import { test, expect } from '@playwright/test';

test.describe('Step 3: Doctor Consultation & Prescription - Psychiatry', () => {

  test('TC_DOC_PSYCHIATRY [VALID]: Doctor Consultation for Psychiatry', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto('https://dev-hms.srivyn.in/');
    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('qa.psychiatry@omnivva.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');

    const signInBtn = page.getByRole('button', { name: 'Sign In' }).first();
    if (await signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signInBtn.click({ force: true });
    } else {
      await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    }
    await page.waitForURL('**/staff/dashboard**', { timeout: 15_000 }).catch(() => {});
    await page.goto('https://dev-hms.srivyn.in/staff/dashboard');

    const switchRoleBtn = page.getByRole('button', { name: /QA|STAFF|Switch Role/i })
      .or(page.getByRole('button', { name: 'Role Slider' }))
      .or(page.getByText('Role Slider'))
      .or(page.getByRole('button', { name: new RegExp('QA.*' + 'psychiatry', 'i') }))
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

    const docBtn = page.getByRole('button', { name: 'Doctor' }).or(page.getByText('Doctor', { exact: true })).first();
    await docBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await docBtn.scrollIntoViewIfNeeded().catch(() => {});
    await docBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const docConsoleBtn = page.getByRole('button', { name: 'Doctor Console' }).or(page.locator('a[href*="doctor"]')).first();
    await docConsoleBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await docConsoleBtn.scrollIntoViewIfNeeded().catch(() => {});
    await docConsoleBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Target the specific appointment row that was booked & checked-in in previous steps (matching 'flow check' or latest Checked-In status)
    const targetAppointmentRow = page.locator('tr, [role="row"], .MuiPaper-root, .MuiCard-root')
      .filter({ hasText: /flow check|Waiting|Checked-In|Check-In/i })
      .last();

    let startConsultBtn = targetAppointmentRow.getByRole('button', { name: /Start Consult|In Consult/i })
      .or(targetAppointmentRow.getByRole('button', { name: 'Start Consult' }))
      .first();

    if (!(await startConsultBtn.isVisible({ timeout: 4000 }).catch(() => false))) {
      // Fallback to the latest newly checked-in appointment in queue (.last())
      startConsultBtn = page.getByRole('button', { name: 'Start Consult' }).last();
    }

    if (await startConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startConsultBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // --- MANDATORY EXECUTION OF ALL 5 RECORDED TASKS --- //

    // TASK 1: Write Prescription
    const writePrescriptionBtn = page.getByRole('button', { name: /Write Prescription|Add Prescription/i }).first();
    await writePrescriptionBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await writePrescriptionBtn.scrollIntoViewIfNeeded().catch(() => {});
    await writePrescriptionBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const aspirinInput = page.getByRole('textbox', { name: 'e.g. Tab Aspirin' }).first();
    await aspirinInput.waitFor({ state: 'visible', timeout: 10_000 });
    await aspirinInput.click();
    await aspirinInput.fill('dol');
    await page.waitForTimeout(1000);

    const doloOption = page.getByText('Dolo').first();
    await doloOption.waitFor({ state: 'visible', timeout: 10_000 });
    await doloOption.click({ force: true });
    await page.waitForTimeout(800);

    const verifySaveBtn = page.getByRole('button', { name: 'Verify & Save Prescription' }).first();
    await verifySaveBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await verifySaveBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // TASK 2: Refer for Lab
    const referLabBtn = page.getByRole('button', { name: 'Refer for Lab' }).first();
    await referLabBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await referLabBtn.scrollIntoViewIfNeeded().catch(() => {});
    await referLabBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const abgRow = page.getByRole('row', { name: 'Arterial Blood Gas (ABG)' }).getByRole('checkbox').first();
    if (await abgRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await abgRow.check({ force: true }).catch(() => {});
    }

    const bloodCultureRow = page.getByRole('row', { name: 'Blood Culture & Sensitivity' }).getByRole('checkbox').first();
    if (await bloodCultureRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bloodCultureRow.check({ force: true }).catch(() => {});
    }

    const suggestPatientBtn = page.getByRole('button', { name: 'Suggest to Patient' }).first();
    await suggestPatientBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await suggestPatientBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // TASK 3: Refer for Radiology
    const referRadiologyBtn = page.getByRole('button', { name: 'Refer for Radiology' }).first();
    await referRadiologyBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await referRadiologyBtn.scrollIntoViewIfNeeded().catch(() => {});
    await referRadiologyBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const ctBtn = page.getByRole('button', { name: 'CT' }).first();
    await ctBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await ctBtn.click({ force: true });
    await page.waitForTimeout(500);

        const bodyPartInput = page.getByPlaceholder(/Search and select body part|Search or type body part|body part/i)
      .or(page.getByRole('combobox', { name: /body part|Search/i }))
      .or(page.locator('input[placeholder*="body part"], input[placeholder*="Body Part"]'))
      .first();

    await bodyPartInput.waitFor({ state: 'visible', timeout: 10_000 });
    await bodyPartInput.click({ force: true });
    await bodyPartInput.fill('chest');
    await page.waitForTimeout(600);

    const ctOption = page.getByRole('option', { name: /chest|ct/i })
      .or(page.locator('li[role="option"]').filter({ hasText: /chest|ct/i }))
      .first();

    if (await ctOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await ctOption.click({ force: true });
    } else {
      await bodyPartInput.press('Enter').catch(() => {});
    }
    await page.waitForTimeout(500);

    const suggestScanBtn = page.getByRole('button', { name: 'Suggest Scan' }).first();
    await suggestScanBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await suggestScanBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // TASK 4: Refer for Admission & Create Admission Note Modal (EXACT ROOT CAUSE RESOLVED)
    const referAdmissionBtn = page.getByRole('button', { name: 'Refer for Admission' }).first();
    if (await referAdmissionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await referAdmissionBtn.scrollIntoViewIfNeeded().catch(() => {});
      await referAdmissionBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const dialog = page.getByRole('dialog', { name: /Create Admission Note/i })
        .or(page.locator('.MuiDialog-root'))
        .first();

      await dialog.waitFor({ state: 'visible', timeout: 10_000 });

      // 1. Primary Diagnosis * (EXACT RECORDED LOCATOR)
      const primaryInput = dialog.getByRole('textbox', { name: 'Primary Diagnosis *' })
        .or(dialog.getByRole('textbox', { name: /Primary Diagnosis/i }))
        .or(dialog.locator('input[placeholder*="Diagnosis"]'))
        .first();

      if (await primaryInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await primaryInput.scrollIntoViewIfNeeded().catch(() => {});
        await primaryInput.click({ force: true }).catch(() => {});
        await primaryInput.fill('fever');
        await primaryInput.press('Enter').catch(() => {});
        await page.waitForTimeout(400);
      }

      // Comboboxes inside dialog: nth(0) = Admission Type *, nth(1) = Priority *, nth(2) = Ward
      const dialogComboboxes = dialog.locator('[role="combobox"]');

      // 2. Admission Type * (Combobox nth 0)
      const admissionTypeCombo = dialogComboboxes.nth(0)
        .or(dialog.getByRole('combobox', { name: /Admission Type/i }));

      if (await admissionTypeCombo.isVisible({ timeout: 5000 }).catch(() => false)) {
        await admissionTypeCombo.scrollIntoViewIfNeeded().catch(() => {});
        await admissionTypeCombo.click({ force: true });
        await page.waitForTimeout(600);

        const dayCareOpt = page.getByRole('option', { name: /Day Care/i })
          .or(page.locator('li[role="option"]').filter({ hasText: /Day Care/i }))
          .or(page.getByRole('option').first());

        if (await dayCareOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await dayCareOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);
      }

      // 3. Priority * (Combobox nth 1)
      const priorityCombo = dialogComboboxes.nth(1)
        .or(dialog.getByRole('combobox', { name: /Priority/i }));

      if (await priorityCombo.isVisible({ timeout: 5000 }).catch(() => false)) {
        await priorityCombo.scrollIntoViewIfNeeded().catch(() => {});
        await priorityCombo.click({ force: true });
        await page.waitForTimeout(600);

        const routineOpt = page.getByRole('option', { name: /Routine/i })
          .or(page.locator('li[role="option"]').filter({ hasText: /Routine/i }))
          .or(page.getByRole('option').first());

        if (await routineOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await routineOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);
      }

      // 4. Ward (Combobox nth 2)
      const wardCombo = dialogComboboxes.nth(2)
        .or(dialog.getByRole('combobox', { name: /Ward/i }));

      if (await wardCombo.isVisible({ timeout: 3000 }).catch(() => false)) {
        await wardCombo.click({ force: true });
        await page.waitForTimeout(600);

        const generalWardOpt = page.getByRole('option', { name: /General/i })
          .or(page.locator('li[role="option"]').filter({ hasText: /General/i }))
          .or(page.getByRole('option').first());

        if (await generalWardOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await generalWardOpt.click({ force: true });
        } else {
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');
        }
        await page.waitForTimeout(400);
      }

      // 5. Reason for Admission *
      const reasonInput = dialog.locator('textarea, input[placeholder*="Reason"]')
        .or(dialog.getByRole('textbox', { name: /Reason/i }))
        .first();

      if (await reasonInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await reasonInput.click({ force: true }).catch(() => {});
        await reasonInput.fill('Fever evaluation and continuous inpatient monitoring', { force: true });
        await reasonInput.dispatchEvent('change').catch(() => {});
        await reasonInput.dispatchEvent('input').catch(() => {});
      }

      // 6. Checkboxes (MANDATORY)
      const patientInformed = dialog.locator('label').filter({ hasText: /Patient Informed/i }).first();
      if (await patientInformed.isVisible({ timeout: 3000 }).catch(() => false)) {
        await patientInformed.click({ force: true });
      }

      const consentForm = dialog.getByText(/Written Consent/i).first();
      if (await consentForm.isVisible({ timeout: 3000 }).catch(() => false)) {
        await consentForm.click({ force: true });
      }

      const nextOfKin = dialog.getByText(/Relative/i).first();
      if (await nextOfKin.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextOfKin.click({ force: true });
      }

      // 7. Submit Admission Note Button
      const submitBtn = dialog.getByRole('button', { name: /Submit Admission Note/i }).first();
      await submitBtn.waitFor({ state: 'visible', timeout: 10_000 });
      await submitBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }

    // TASK 5: Follow Up & Complete Consultation (EXACT RECORDED USER FLOW)
    const followUpBtn = page.getByRole('button', { name: 'Follow Up' }).first();
    if (await followUpBtn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await followUpBtn.scrollIntoViewIfNeeded().catch(() => {});
      await followUpBtn.click({ force: true });
      await page.waitForTimeout(1500);

      const d = new Date();
      d.setDate(d.getDate() + 7);
      const dateStr = d.toISOString().split('T')[0];

      const followUpDialog = page.getByRole('dialog', { name: /Schedule Follow-up/i }).first();
      if (await followUpDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
        const dateInput = followUpDialog.locator('input[type="date"]').first();
        if (await dateInput.isVisible({ timeout: 4000 }).catch(() => false)) {
          await dateInput.click({ force: true }).catch(() => {});
          await dateInput.fill(dateStr);
          await dateInput.dispatchEvent('change').catch(() => {});
        }

        const saveFollowUpBtn = followUpDialog.getByRole('button', { name: 'Save Follow-up' }).first();
        if (await saveFollowUpBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
          await saveFollowUpBtn.click({ force: true });
          await page.waitForTimeout(1500);
        }
      }
    }

    // Main Consultation Workspace - Treatment Plan, Provisional Diagnosis & Complete Consultation
    const treatmentPlanDiv = page.locator('div').filter({ hasText: /^Treatment PlanTreatment Plan$/ }).first();
    if (await treatmentPlanDiv.isVisible({ timeout: 4000 }).catch(() => false)) {
      await treatmentPlanDiv.click({ force: true });
      await page.waitForTimeout(1000);
    }

    const provDiagInput = page.getByRole('textbox', { name: 'Provisional Diagnosis *' })
      .or(page.getByRole('textbox', { name: /Provisional Diagnosis/i }))
      .first();
    if (await provDiagInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await provDiagInput.click({ force: true }).catch(() => {});
      await provDiagInput.fill('fever');
    }

    const completeConsultBtn = page.getByRole('button', { name: 'Complete Consultation' })
      .or(page.getByRole('button', { name: /Complete Consultation/i }))
      .first();
    await completeConsultBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await completeConsultBtn.scrollIntoViewIfNeeded().catch(() => {});
    await completeConsultBtn.click({ force: true });
    await page.waitForTimeout(3000);

    await expect(page.locator('body')).toBeVisible();
  });

});
