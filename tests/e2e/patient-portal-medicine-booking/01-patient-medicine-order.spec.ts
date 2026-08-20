import { test, expect } from '@playwright/test';

test.describe('Patient Portal: Medicine Order & Online Payment', () => {

  test('TC_PATIENT_MEDICINE_ORDER [VALID]: Order Medicine & Pay via UPI', async ({ page }) => {
    test.setTimeout(120_000);

    // 1. Navigate to HMS Portal
    await page.goto('https://dev-hms.srivyn.in/');

    // 2. Patient Login with Email & OTP
    await page.getByRole('button', { name: 'Patient Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('flowcheck@gmail.com');
    await page.getByRole('button', { name: 'Continue with OTP' }).click();

    const otpInput = page.getByRole('textbox', { name: '••••••' }).or(page.locator('input[type="text"]')).first();
    await otpInput.waitFor({ state: 'visible', timeout: 15_000 });
    await otpInput.fill('0000');

    const verifyBtn = page.getByRole('button', { name: 'Verify Code' });
    if (await verifyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await verifyBtn.click();
    } else {
      await otpInput.press('Enter');
    }

    await page.waitForTimeout(2000);

    // 3. Navigate to Pharmacy -> Prescriptions / Orders
    const pharmacyBtn = page.getByRole('button', { name: 'Pharmacy' }).first();
    await pharmacyBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await pharmacyBtn.click();

    const rxBtn = page.getByRole('button', { name: 'Prescriptions' }).first();
    if (await rxBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await rxBtn.click();
    }

    const ordersDiv = page.locator('div').filter({ hasText: /^Orders$/ }).first();
    if (await ordersDiv.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ordersDiv.click();
    }

    // 4. Add New Medicine Order
    const addNewOrderBtn = page.getByRole('button', { name: 'Add new order' }).first();
    await addNewOrderBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await addNewOrderBtn.click();

    // 5. Select Drug 1: Alprazolam 0.5mg
    const searchDrugCombo1 = page.getByRole('combobox', { name: 'Search drug by trade or' }).first();
    await searchDrugCombo1.waitFor({ state: 'visible', timeout: 15_000 });
    await searchDrugCombo1.click();
    await page.waitForTimeout(500);

    const drug1Opt = page.getByText('Alprazolam 0.5mg').first();
    await drug1Opt.waitFor({ state: 'visible', timeout: 10_000 });
    await drug1Opt.click();
    await page.waitForTimeout(500);

    // 6. Select Drug 2: 100mg · Allopurinol
    const searchDrugCombo2 = page.getByRole('combobox', { name: 'Search drug by trade or' }).first();
    await searchDrugCombo2.click();
    await page.waitForTimeout(500);

    const drug2Opt = page.getByText('100mg · Allopurinol').first();
    await drug2Opt.waitFor({ state: 'visible', timeout: 10_000 });
    await drug2Opt.click();
    await page.waitForTimeout(500);

    // 7. Place Order
    const placeOrderBtn = page.getByRole('button', { name: /Place order/i }).first();
    await placeOrderBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await placeOrderBtn.click();
    await page.waitForTimeout(1500);

    // 8. Select UPI / QR Payment & Enter UPI ID
    const upiOption = page.getByText('UPI / QR').first();
    await upiOption.waitFor({ state: 'visible', timeout: 10_000 });
    await upiOption.click();

    const upiInput = page.getByRole('textbox', { name: 'yourname@upi' }).first();
    await upiInput.waitFor({ state: 'visible', timeout: 10_000 });
    await upiInput.click();
    await upiInput.fill('gk@upi');

    // 9. Pay Now
    const payNowBtn = page.getByRole('button', { name: /Pay Now/i }).first();
    await payNowBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await payNowBtn.click();

    await page.waitForTimeout(3000);
    await expect(page.locator('body')).toBeVisible();
  });

});
