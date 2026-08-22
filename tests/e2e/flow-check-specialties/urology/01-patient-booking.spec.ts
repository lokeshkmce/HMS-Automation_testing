import { test, expect } from '@playwright/test';
import testData from '../../../../test-data/hmsTestData.json';

test.describe('Step 1: Patient Appointment Booking - Urology', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_APPT_UROLOGY [VALID]: Patient Appointment Booking for Urology', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

    await page.getByRole('button', { name: 'Patient Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill(testData.patientUser.email);
    await page.getByRole('button', { name: 'Continue with OTP' }).click();

    const otpInput = page.getByRole('textbox', { name: '••••••' }).or(page.locator('input[type="password"], input[type="text"]')).first();
    await otpInput.waitFor({ state: 'visible', timeout: 10_000 });
    await otpInput.fill(testData.patientUser.otp);
    await page.getByRole('button', { name: 'Verify Code' }).click();

    const bookDoctorLink = page.getByRole('link', { name: /Book Doctor/i }).first();
    await bookDoctorLink.waitFor({ state: 'visible', timeout: 15_000 });
    await bookDoctorLink.click();

    const routineCheckupBtn = page.getByRole('button', { name: 'Routine Checkup' }).first();
    await routineCheckupBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await routineCheckupBtn.click({ force: true });
    await page.waitForTimeout(500);

    const nextBtn1 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn1.waitFor({ state: 'visible', timeout: 10_000 });
    await nextBtn1.click({ force: true });
    await page.waitForTimeout(1500);

    const facilityList = [
      'Omnivva Central Hospital',
      'CareBridge Rural Health Center',
      'CareBridge District Hospital',
      'LifeLine Super Specialty',
      'LifeLine Trauma Center',
      'MedCare General Hospital',
      'MedCare Polyclinic',
      'Omnivva Cardiac Center',
      'Wellspring First AYUSH Center',
      'Wellspring First Clinic'
    ];

    let specialtySelected = false;

    for (const facName of facilityList) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(200);

      const facCombobox = page.locator('div').filter({ hasText: /^Facility$/ }).locator('[role="combobox"]')
        .or(page.getByText('Select Facility'))
        .or(page.getByRole('combobox').nth(1))
        .first();

      if (await facCombobox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await facCombobox.click({ force: true });
        await page.waitForTimeout(400);

        const facOption = page.getByRole('option', { name: facName }).first();
        if (await facOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await facOption.click({ force: true });
          await page.waitForTimeout(600);
        } else {
          await page.keyboard.press('Escape').catch(() => {});
          continue;
        }
      }

      const specCombobox = page.locator('div').filter({ hasText: /^Specialty$/ }).locator('[role="combobox"]')
        .or(page.getByText('Select Specialty'))
        .first();

      await specCombobox.waitFor({ state: 'visible', timeout: 5000 });
      await specCombobox.click({ force: true });
      await page.waitForTimeout(500);

      const firstWord = 'Urology'.split(' ')[0];
      const targetOption = page.getByRole('option', { name: 'Urology', exact: true })
        .or(page.getByRole('option', { name: new RegExp('^' + 'Urology' + '$', 'i') }))
        /* removed loose firstWord option */
        /* removed loose firstWord li */
        .first();

      if (await targetOption.isVisible({ timeout: 1500 }).catch(() => false)) {
        await targetOption.click({ force: true });
        await page.waitForTimeout(600);
        specialtySelected = true;
        break;
      } else {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    const nextBtn2 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn2.waitFor({ state: 'visible', timeout: 10_000 });
    await nextBtn2.click({ force: true });
    await page.waitForTimeout(1500);

    const targetDocText = page.getByText(new RegExp('Dr\\. QA urology', 'i'))
      .or(page.getByText(new RegExp('Dr\\.\\s*QA\\s*' + 'urology', 'i')))
      .first();

    await expect(targetDocText, `Target QA Doctor "Dr. QA urology" must be visible on Doctor Selection page`).toBeVisible({ timeout: 15_000 });
    await targetDocText.click({ force: true });
    await page.waitForTimeout(600);

    const docCardContainer = targetDocText.locator('xpath=ancestor::div[contains(@class, "MuiCard") or contains(@class, "Paper") or contains(@class, "card")][1]');
    const selectBtn = docCardContainer.locator('button, [role="button"], div').filter({ hasText: /₹|Fee|Select|Book/i }).first();
    if (await selectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await selectBtn.click({ force: true });
      await page.waitForTimeout(600);
    }

    const nextBtnStep3 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtnStep3.click({ force: true });
    await page.waitForTimeout(1500);

    const availableSlot = page.getByRole('button', { name: /\d{1,2}:\d{2}\s*(AM|PM)?/i })
      .or(page.locator('button').filter({ hasText: /:\d{2}/i }))
      .filter({ hasNotText: /Next|Back|Cancel/i })
      .first();

    let slotFound = false;

    if (await availableSlot.isVisible({ timeout: 3000 }).catch(() => false)) {
      slotFound = true;
    } else {
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
          const d = new Date();
          d.setDate(d.getDate() + dayOffset);
          const dateStr = d.toISOString().split('T')[0];
          await dateInput.fill(dateStr);
          await page.waitForTimeout(800);
          if (await availableSlot.isVisible({ timeout: 2000 }).catch(() => false)) {
            slotFound = true;
            break;
          }
        }
      }
    }

    if (!slotFound) {
      throw new Error(`Process Stopped: Target QA Doctor "Dr. QA urology" has 0 available slots! Skipping booking for non-QA doctors as requested.`);
    }

    await availableSlot.click({ force: true });
    await page.getByRole('button', { name: 'Next' }).click();

    const symptomsInput = page.getByRole('textbox', { name: /Describe your symptoms/i }).or(page.locator('textarea, input[placeholder*="symptoms"]')).first();
    if (await symptomsInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await symptomsInput.fill('Routine Urology checkup');
    }
    await page.getByRole('button', { name: 'Next' }).click();

    await page.getByRole('button', { name: 'Confirm & Pay' }).click();
    await page.getByText('UPI / QR').click();

    const upiInput = page.getByRole('textbox', { name: 'yourname@upi' }).or(page.locator('input[placeholder*="upi"]')).first();
    await upiInput.fill('gk@upi');

    const payNowBtn = page.getByRole('button', { name: /Pay Now/i }).first();
    await payNowBtn.waitFor({ state: 'visible', timeout: 5000 });
    await payNowBtn.click({ force: true });

    const confirmHeading = page.getByText(/Appointment Confirmed!/i)
      .or(page.getByText(/Your Token Number|Active Queue|Success|Confirmed/i))
      .first();

    await expect(confirmHeading).toBeVisible({ timeout: 30_000 });
  });

});
