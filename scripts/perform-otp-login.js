const { chromium } = require('@playwright/test');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const PHONE_NUMBER = '9952180176';
const BASE_URL = 'https://sit-admission.navacle.com';
const AUTH_FILE = path.join(__dirname, '..', '.auth', 'parentStorageState.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
  console.log('🚀 Starting browser to perform OTP Login...');
  const userDataDir = path.join(__dirname, '..', '.auth', 'chrome_profile');
  
  // Ensure the directory exists
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const context = await chromium.launchPersistentContext(userDataDir, { headless: false });
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle').catch(() => {});

    // CHECK IF ALREADY LOGGED IN
    if (page.url().includes('/parent')) {
      console.log('✅ You are already logged in! Skipping OTP step...');
      await page.waitForTimeout(2000);
      await page.context().storageState({ path: AUTH_FILE });
      return;
    }

    // Click Parent
    const parentCard = page.locator('text=Parent').first();
    if (await parentCard.isVisible()) await parentCard.click();
    await page.waitForTimeout(1000);

    // Click Get Started
    const getStarted = page.getByRole('button', { name: /get started/i }).first();
    if (await getStarted.isVisible()) await getStarted.click();
    await page.waitForTimeout(1500);

    // Select Phone tab
    const phoneTab = page.getByRole('button', { name: /phone/i }).first();
    if (await phoneTab.isVisible()) await phoneTab.click();
    await page.waitForTimeout(500);

    // Fill phone number
    const inputs = page.locator('input').filter({ hasNot: page.locator('[type="hidden"]') });
    await inputs.last().click();
    await inputs.last().pressSequentially(PHONE_NUMBER, { delay: 100 });
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);

    // Send OTP
    const sendBtn = page.getByRole('button', { name: /send.*otp|send login otp/i }).first();
    if (await sendBtn.isVisible()) await sendBtn.click();
    console.log('✅ OTP requested. Please check your phone.');

    // Wait for the OTP inputs to appear
    await page.waitForTimeout(2000);

    // Prompt user in terminal
    const otp = (await ask('\n📱 Enter the 6-digit OTP received: ')).trim();
    if (!otp) throw new Error('No OTP entered.');

    console.log('⏳ Verifying OTP...');

    // Enter OTP
    // We ignore the phone number input which is now marked 'readonly' or 'disabled'
    const otpInputs = page.locator('input:not([type="hidden"]):not([readonly]):not([disabled])');
    
    // Wait for the OTP inputs to be attached
    await otpInputs.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    
    const cnt = await otpInputs.count();
    if (cnt >= 4) { // Array of single-digit inputs (usually 6)
      for (let i = 0; i < Math.min(cnt, otp.length); i++) {
        await otpInputs.nth(i).focus();
        await page.keyboard.type(otp[i], { delay: 50 });
      }
    } else if (cnt > 0) { // Single input field
      await otpInputs.first().focus();
      await page.keyboard.type(otp, { delay: 50 });
    } else {
      throw new Error('Could not find OTP input fields on the screen.');
    }
    await page.waitForTimeout(1000);

    // Click Verify
    const verifyBtn = page.getByRole('button', { name: /verify|submit|confirm/i }).first();
    if (await verifyBtn.isVisible().catch(() => false)) await verifyBtn.click();

    // Wait for successful login (dashboard)
    await page.waitForURL(`${BASE_URL}/parent`, { timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});

    console.log('✅ Login successful! Saving session...');
    // Give it 2 seconds to ensure all local IndexedDB/React states are flushed to disk
    await page.waitForTimeout(2000);
    
    // Save state to JSON file so parallel workers can use it without locking
    await page.context().storageState({ path: AUTH_FILE });
    console.log(`✅ Session saved to ${AUTH_FILE}`);

  } catch (error) {
    console.error('❌ Error during OTP login:', error.message);
    process.exit(1);
  } finally {
    await context.close();
    rl.close();
  }
})();
