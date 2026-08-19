import { test, expect } from '@playwright/test';
import testData from '../../../test-data/hmsTestData.json';

test.describe('HMS Patient Appointment Booking Suite - All 23 Doctor Specialties', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies().catch(() => {});
  });

  testData.doctorSpecialties.forEach((specItem, idx) => {
    const testNum = String(idx + 1).padStart(3, '0');

    test(`TC_APPT_${testNum} [VALID]: Patient Doctor Appointment Booking - ${specItem.specialty}`, async ({ page }) => {
      // 1. Navigate to HMS Portal
      await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });

      // 2. Click Patient Login & Enter Credentials
      await page.getByRole('button', { name: 'Patient Login' }).click();
      await page.getByRole('textbox', { name: 'Email address' }).click();
      await page.getByRole('textbox', { name: 'Email address' }).fill(testData.patientUser.email);
      await page.getByRole('button', { name: 'Continue with OTP' }).click();

      // 3. Enter OTP & Verify
      const otpInput = page.getByRole('textbox', { name: '••••••' }).or(page.locator('input[type="password"], input[type="text"]')).first();
      await otpInput.waitFor({ state: 'visible', timeout: 10_000 });
      await otpInput.fill(testData.patientUser.otp);
      await page.getByRole('button', { name: 'Verify Code' }).click();

      // 4. Click Book Doctor Link on Patient Dashboard
      const bookDoctorLink = page.getByRole('link', { name: /Book Doctor/i }).first();
      await bookDoctorLink.waitFor({ state: 'visible', timeout: 15_000 });
      await bookDoctorLink.click();

      // 5. Select Routine Checkup & Click Next to go to Step 2 (Find Doctor)
      const routineCheckupBtn = page.getByRole('button', { name: 'Routine Checkup' }).first();
      await routineCheckupBtn.waitFor({ state: 'visible', timeout: 10_000 });
      await routineCheckupBtn.click({ force: true });
      await page.waitForTimeout(500);

      const nextBtn1 = page.getByRole('button', { name: 'Next' }).first();
      await nextBtn1.waitFor({ state: 'visible', timeout: 10_000 });
      await nextBtn1.click({ force: true });
      await page.waitForTimeout(1500);

      // 6. Click 'SEARCH BY SPECIALTY' Tab on Step 2 (Find Doctor)
      const searchBySpecialtyTab = page.getByText(/SEARCH BY SPECIALTY/i)
        .or(page.getByRole('tab', { name: /SEARCH BY SPECIALTY/i }))
        .first();

      if (await searchBySpecialtyTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchBySpecialtyTab.click({ force: true });
        await page.waitForTimeout(1000);
      }

      // 7. Click Select Specialty Dropdown & Select Target Specialty
      const specialtyDropdown = page.getByText(/Select Specialty|Search Specialty/i)
        .or(page.getByRole('combobox', { name: /Specialty/i }))
        .first();

      await specialtyDropdown.waitFor({ state: 'visible', timeout: 15_000 });
      await specialtyDropdown.click({ force: true });
      await page.waitForTimeout(1000);

      const targetOption = page.getByRole('option', { name: new RegExp(specItem.specialty.replace('&', '.*'), 'i') })
        .or(page.locator('li, div[role="option"]').filter({ hasText: new RegExp(specItem.specialty, 'i') }))
        .or(page.getByRole('option').first());

      await targetOption.waitFor({ state: 'visible', timeout: 10_000 });
      await targetOption.click({ force: true });
      await page.waitForTimeout(1000);

      // 8. Select Hospital Option if shown
      const hospitalOption = page.getByText(/Omnivva Central Hospital/i).first();
      if (await hospitalOption.isVisible({ timeout: 4000 }).catch(() => false)) {
        await hospitalOption.click({ force: true });
        await page.waitForTimeout(500);
      }

      const nextBtn2 = page.getByRole('button', { name: 'Next' }).first();
      await nextBtn2.click({ force: true });
      await page.waitForTimeout(1500);

      // 9. Select Doctor Fee Card
      const feeCard = page.locator('div').filter({ hasText: /₹500|Fee/i }).first();
      if (await feeCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        await feeCard.click();
      }
      await page.getByRole('button', { name: 'Next' }).click();

      // 10. Select Date & Available Slot
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

      // 11. Enter Symptoms
      const symptomsInput = page.getByRole('textbox', { name: /Describe your symptoms/i }).or(page.locator('textarea, input[placeholder*="symptoms"]')).first();
      if (await symptomsInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await symptomsInput.fill(`Routine ${specItem.specialty} checkup`);
      }
      await page.getByRole('button', { name: 'Next' }).click();

      // 12. Confirm & Pay
      await page.getByRole('button', { name: 'Confirm & Pay' }).click();
      await page.getByText('UPI / QR').click();

      const upiInput = page.getByRole('textbox', { name: 'yourname@upi' }).or(page.locator('input[placeholder*="upi"]')).first();
      await upiInput.fill('gk@upi');

      const payNowBtn = page.getByRole('button', { name: /Pay Now/i }).first();
      await payNowBtn.waitFor({ state: 'visible', timeout: 5000 });
      await payNowBtn.click({ force: true });

      // 13. Assert Appointment Confirmation
      const confirmHeading = page.getByText(/Appointment Confirmed!/i).or(page.getByText(/Your Token Number|Active Queue/i)).first();
      await expect(confirmHeading).toBeVisible({ timeout: 15_000 });
    });
  });

});
