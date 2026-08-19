import { test, expect } from '@playwright/test';
import testData from '../../../../test-data/hmsTestData.json';
import { LoginPage } from '../../../../pages/login.page';

test.describe('Step 1: Patient Appointment Booking - Internal Medicine', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_APPT_INTERNAL_MEDICINE [VALID]: Patient Appointment Booking for Internal Medicine', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsPatient(testData.patientUser.email, testData.patientUser.otp);

    const bookDoctorBtn = page.getByRole('button', { name: /Book Doctor/i })
      .or(page.getByRole('link', { name: /Book Doctor/i }))
      .or(page.locator('a[href*="book-doctor"]'))
      .first();

    if (await bookDoctorBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await bookDoctorBtn.click({ force: true });
    } else {
      await page.goto('https://dev-hms.srivyn.in/patient/book-doctor', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    await page.waitForTimeout(1000);
    const routineCheckupBtn = page.getByRole('button', { name: /Routine Checkup/i })
      .or(page.getByText(/Routine Checkup/i))
      .first();

    await routineCheckupBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await routineCheckupBtn.click({ force: true });
    await page.waitForTimeout(500);

    const nextBtn1 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn1.waitFor({ state: 'visible', timeout: 10_000 });
    await nextBtn1.click({ force: true });
    await page.waitForTimeout(1500);

    const facilityList = [
      'CareBridge District Hospital',
      'CareBridge Rural Health Center',
      'LifeLine Super Specialty',
      'LifeLine Trauma Center',
      'MedCare General Hospital',
      'MedCare Polyclinic',
      'Omnivva Cardiac Center',
      'Omnivva Central Hospital',
      'Wellspring First AYUSH Center',
      'Wellspring First Clinic'
    ];

    let currentFacilityText = 'Select Facility';
    let specialtyFound = false;

    const firstWord = 'Internal Medicine'.split(' ')[0];

    for (let i = 0; i < facilityList.length; i++) {
      const facName = facilityList[i];

      const facilityTrigger = page.getByText(currentFacilityText).first();
      await facilityTrigger.click();
      await page.waitForTimeout(400);

      const facOption = page.getByRole('option', { name: facName }).first();
      if (await facOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await facOption.click();
        currentFacilityText = facName;
        await page.waitForTimeout(600);
      } else {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(300);
        continue;
      }

      const specialtyTrigger = page.getByText('Select Specialty').first();
      await specialtyTrigger.click();
      await page.waitForTimeout(400);

      const targetOption = page.getByRole('option', { name: 'Internal Medicine', exact: true })
        .or(page.getByRole('option', { name: new RegExp('^' + 'Internal Medicine' + '$', 'i') }))
        .or(page.getByRole('option', { name: new RegExp(firstWord, 'i') }))
        .or(page.locator('li[role="option"]').filter({ hasText: new RegExp(firstWord, 'i') }))
        .first();

      if (await targetOption.isVisible({ timeout: 1500 }).catch(() => false)) {
        await targetOption.click();
        await page.waitForTimeout(800);
        specialtyFound = true;
        break;
      } else {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    const nextBtn2 = page.getByRole('button', { name: 'Next' }).first();
    await nextBtn2.click({ force: true });
    await page.waitForTimeout(1500);

    const targetDocCard = page.getByText('Dr. QA internal.medicine', { exact: false })
      .or(page.locator('div, .MuiCard-root, .MuiPaper-root').filter({ hasText: 'Internal Medicine' }))
      .first();

    if (await targetDocCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await targetDocCard.click({ force: true });
      await page.waitForTimeout(800);
    } else {
      const feeCard = page.locator('div').filter({ hasText: /₹500|Fee/i }).first();
      if (await feeCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await feeCard.click({ force: true });
        await page.waitForTimeout(600);
      }
    }

    await page.getByRole('button', { name: 'Next' }).click();

    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const dateObj = new Date();
      let dateStr = dateObj.toISOString().split('T')[0];
      await dateInput.fill(dateStr);
      await page.waitForTimeout(1000);

      const noSlotsText = page.getByText(/No slots available/i);
      if (await noSlotsText.isVisible({ timeout: 2000 }).catch(() => false)) {
        dateObj.setDate(dateObj.getDate() + 1);
        dateStr = dateObj.toISOString().split('T')[0];
        await dateInput.fill(dateStr);
        await page.waitForTimeout(1000);
      }
    }

    const availableSlot = page.getByRole('button', { name: /\d{1,2}:\d{2}\s*(AM|PM)?/i })
      .or(page.locator('button').filter({ hasText: /:\d{2}/i }))
      .filter({ hasNotText: /Next|Back|Cancel/i })
      .first();

    await availableSlot.waitFor({ state: 'visible', timeout: 10_000 });
    await availableSlot.click();
    await page.getByRole('button', { name: 'Next' }).click();

    const symptomsInput = page.getByRole('textbox', { name: /Describe your symptoms/i }).or(page.locator('textarea, input[placeholder*="symptoms"]')).first();
    if (await symptomsInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await symptomsInput.fill('Routine Internal Medicine checkup');
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
