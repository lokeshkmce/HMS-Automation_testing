import { test, expect } from '@playwright/test';

test.describe('Step 2: Receptionist Check-In & Nurse Triage - Plastic Surgery', () => {

  test('TC_TRIAGE_PLASTIC_SURGERY [VALID]: Receptionist Check-In & Triage for Plastic Surgery', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('https://dev-hms.srivyn.in/');

    await page.getByRole('button', { name: 'Staff Login' }).click();
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('qa.plastic.surgery@omnivva.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');
    
    const signInBtn = page.getByRole('button', { name: 'Sign In' });
    if (await signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signInBtn.click();
    } else {
      await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    }
    await page.waitForTimeout(3000);

    const switchRoleBtn = page.getByRole('button', { name: /QA|STAFF|Switch Role/i })
      .or(page.getByRole('button', { name: 'Role Slider' }))
      .or(page.getByText('Role Slider'))
      .first();

    await switchRoleBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await switchRoleBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);

    const switchSubBtn = page.getByRole('button', { name: 'Switch Role' }).first();
    if (await switchSubBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await switchSubBtn.click({ force: true });
      await page.waitForTimeout(1000);
    }

    const receptionistCard = page.getByRole('button', { name: 'Receptionist' })
      .or(page.getByText('Receptionist', { exact: true }))
      .first();

    await receptionistCard.waitFor({ state: 'visible', timeout: 10_000 });
    await receptionistCard.click({ force: true });
    await page.waitForTimeout(2000);

    const checkInBtn = page.getByRole('button', { name: 'Check‑In Screen' })
      .or(page.getByRole('link', { name: 'Check‑In Screen' }))
      .or(page.getByRole('button', { name: 'Check-In Screen' }))
      .or(page.getByText('Check‑In Screen'))
      .or(page.getByText('Check-In Screen'))
      .first();

    await checkInBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await checkInBtn.click({ force: true });
    await page.waitForTimeout(2500);

    const allDoctorsFilter = page.getByText('All Doctors').or(page.getByRole('combobox')).first();
    await allDoctorsFilter.waitFor({ state: 'visible', timeout: 15_000 });
    await allDoctorsFilter.click({ force: true });
    await page.waitForTimeout(600);

    const docOption = page.getByRole('option', { name: 'Dr. QA plastic.surgery' })
      .or(page.getByRole('option', { name: new RegExp('Dr\\. QA plastic.surgery', 'i') }))
      .or(page.getByRole('option', { name: new RegExp('QA\\s*' + 'plastic', 'i') }))
      .first();

    await expect(docOption, `QA Doctor "Dr. QA plastic.surgery" must be visible in dropdown`).toBeVisible({ timeout: 15_000 });
    await docOption.click({ force: true });
    await page.waitForTimeout(1500);

    // 1. TARGET THE LATEST FRESHLY BOOKED PATIENT CARD IN QUEUE VIA .last()
    const patientCardToken = page.locator('.MuiCard-root, .MuiPaper-root, tr, li, div')
      .filter({ hasText: /flow check/i })
      .last();

    await patientCardToken.waitFor({ state: 'visible', timeout: 15_000 });
    await patientCardToken.click({ force: true });
    await page.waitForTimeout(1000);

    // 2. IF PATIENT STATUS IS "Pending Check-In", CLICK "Check-In Patient" BUTTON FIRST!
    const checkInPatientBtn = page.getByRole('button', { name: /Check-In Patient|Check In Patient/i })
      .or(page.locator('button').filter({ hasText: /Check-In Patient|Check In Patient/i }))
      .first();

    if (await checkInPatientBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await checkInPatientBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    // 3. CLICK THE GREEN "Proceed to Nurse Triage & Vitals" BUTTON
    const proceedTriageBtn = page.getByRole('button', { name: /Proceed to Nurse Triage/i })
      .or(page.getByRole('button', { name: /Nurse Triage/i }))
      .or(page.locator('button').filter({ hasText: /Proceed to Nurse Triage|Nurse Triage/i }))
      .first();

    if (await proceedTriageBtn.isVisible({ timeout: 6000 }).catch(() => false)) {
      await proceedTriageBtn.scrollIntoViewIfNeeded().catch(() => {});
      await proceedTriageBtn.click({ force: true });
      await page.waitForTimeout(2500);
    }

    // 4. NURSE TRIAGE / PRE-CONSULTATION FORM FILLING
    const complaintInput = page.locator('textarea, input[name*="complaint"], input[placeholder*="Complaint"], input[placeholder*="symptoms"], textarea[name*="complaint"]')
      .or(page.getByRole('textbox', { name: /Chief Complaint|Symptoms|None/i }))
      .or(page.getByRole('textbox', { name: 'None' }))
      .first();

    await complaintInput.waitFor({ state: 'visible', timeout: 25_000 });
    await complaintInput.click();
    await complaintInput.fill('Routine Plastic Surgery checkup and nurse triage evaluation');

    const bpSystolic = page.getByRole('spinbutton', { name: '120' })
      .or(page.locator('input[placeholder*="120"], input[name*="systolic"]'))
      .first();
    if (await bpSystolic.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bpSystolic.click();
      await bpSystolic.fill('110');
    }

    const bpDiastolic = page.getByRole('spinbutton', { name: '80' })
      .or(page.locator('input[placeholder*="80"], input[name*="diastolic"]'))
      .first();
    if (await bpDiastolic.isVisible({ timeout: 4000 }).catch(() => false)) {
      await bpDiastolic.click();
      await bpDiastolic.fill('80');
    }

    const pulseInput = page.getByRole('spinbutton', { name: '72' })
      .or(page.locator('input[placeholder*="72"], input[name*="pulse"]'))
      .first();
    if (await pulseInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await pulseInput.click();
      await pulseInput.fill('72');
    }

    const tempInput = page.getByRole('spinbutton', { name: '98.6' })
      .or(page.locator('input[placeholder*="98"], input[name*="temp"]'))
      .first();
    if (await tempInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await tempInput.click();
      await tempInput.fill('98.6');
    }

    const spo2Input = page.getByRole('spinbutton', { name: '--' }).nth(2)
      .or(page.getByRole('spinbutton', { name: '98' }))
      .or(page.locator('input[placeholder*="98"], input[name*="spo2"]'))
      .first();
    if (await spo2Input.isVisible({ timeout: 4000 }).catch(() => false)) {
      await spo2Input.click();
      await spo2Input.fill('98');
    }

    const syncEmrBtn = page.getByRole('button', { name: 'Submit Form to Doctor' })
      .or(page.getByRole('button', { name: /Submit Form to Doctor|Sync to EMR|Submit/i }))
      .first();

    await syncEmrBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await syncEmrBtn.click({ force: true });
    await page.waitForTimeout(3000);
  });

});
