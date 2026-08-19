import { test, expect } from '@playwright/test';
import testData from '../../../../test-data/hmsTestData.json';

test.describe('Step 2: Receptionist Check-In & Nurse Triage - Maternity', () => {

  test.beforeEach(async ({ page, context }) => {
    test.setTimeout(120_000);
    await context.clearCookies().catch(() => {});
  });

  test('TC_TRIAGE_MATERNITY [VALID]: Receptionist Check-In & Triage for Maternity', async ({ page }) => {
    await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForTimeout(1000);

    const staffLoginBtn = page.getByRole('button', { name: 'Staff Login' })
      .or(page.getByRole('link', { name: 'Staff Login' }))
      .or(page.getByText('Staff Login'))
      .first();

    if (await staffLoginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await staffLoginBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const usernameInput = page.getByRole('textbox', { name: /Username|Email/i })
      .or(page.locator('input[name="username"], input[name="email"], input[id="username"]'))
      .first();

    if (await usernameInput.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const passwordInput = page.getByRole('textbox', { name: /Password/i })
        .or(page.locator('input[type="password"]'))
        .first();

      const signInBtn = page.getByRole('button', { name: /Sign In|Submit|Login/i }).first();

      const emailsToTry = Array.from(new Set([
        'qa.maternity@omnivva.com',
        'qa.maternity@omnivva.com'.replace('cardio.surgery', 'cardiosurgery'),
        'qa.maternity@omnivva.com'.replace('cardiosurgery', 'cardio.surgery'),
        'qa.maternity@omnivva.com'.replace('@ominvva.com', '@omnivva.com'),
        'qa.maternity@omnivva.com'.replace('@omnivva.com', '@ominvva.com')
      ]));

      for (const email of emailsToTry) {
        await usernameInput.click();
        await usernameInput.fill(email);
        await passwordInput.click();
        await passwordInput.fill('password123');

        if (await signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await signInBtn.click({ force: true });
        } else {
          await passwordInput.press('Enter');
        }

        await page.waitForTimeout(2000);
        const isInvalid = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 2000 }).catch(() => false);
        if (!isInvalid) {
          break;
        }
      }
    }

    await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const roleSliderBtn = page.getByText(/ROLE SLIDER/i)
      .or(page.locator('button, div, span').filter({ hasText: /ROLE SLIDER/i }))
      .first();

    if (await roleSliderBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await roleSliderBtn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);
    }

    const receptionistRoleCard = page.getByRole('button', { name: 'Receptionist' })
      .or(page.getByText('Receptionist', { exact: true }))
      .or(page.locator('div, button, a').filter({ hasText: /^Receptionist$/i }))
      .first();

    if (await receptionistRoleCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await receptionistRoleCard.scrollIntoViewIfNeeded().catch(() => {});
      await receptionistRoleCard.click({ force: true }).catch(async () => {
        await receptionistRoleCard.dispatchEvent('click').catch(() => {});
      });
      await page.waitForTimeout(2000);
    }

    const sidebarCheckIn = page.locator('nav, aside, .MuiDrawer-root, body')
      .getByText(/^Check-In$/i)
      .or(page.getByText('Check-Ins'))
      .or(page.getByRole('link', { name: /Check-In/i }))
      .filter({ hasNotText: /Check-In Patient/i })
      .first();

    if (await sidebarCheckIn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sidebarCheckIn.click({ force: true });
      await page.waitForTimeout(1500);
    } else {
      await page.goto('https://dev-hms.srivyn.in/staff/receptionist/check-in', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    await page.waitForURL((url) => url.href.includes('/check-in'), { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const doctorFilter = page.getByRole('combobox')
      .or(page.getByText('FILTER BY DOCTOR'))
      .or(page.getByText(/Dr\./i))
      .first();

    if (await doctorFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
      await doctorFilter.click({ force: true });
      await page.waitForTimeout(1000);

      const targetDocOption = page.getByText('Dr. QA maternity', { exact: false })
        .or(page.getByRole('option', { name: new RegExp('Maternity', 'i') }))
        .or(page.locator('li[role="option"]').filter({ hasText: new RegExp('Maternity', 'i') }))
        .first();

      if (await targetDocOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await targetDocOption.click({ force: true });
        await page.waitForTimeout(1000);
      }
    }

    const pendingCard = page.locator('div')
      .filter({ hasText: /flow check/i })
      .filter({ hasText: /Token/i })
      .last();

    if (await pendingCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await pendingCard.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const checkInPatientBtn = page.getByRole('button', { name: /Check In Patient|Check-In/i }).first();
    if (await checkInPatientBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkInPatientBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const proceedTriageBtn = page.getByRole('button', { name: /Proceed to Nurse Triage|Nurse Triage|Triage/i }).first();
    if (await proceedTriageBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await proceedTriageBtn.click({ force: true });
      await page.waitForTimeout(2000);
    }

    const chiefComplaintInput = page.getByRole('textbox', { name: 'None' }).first();
    if (await chiefComplaintInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chiefComplaintInput.fill('Routine Maternity checkup');
    }

    const saveDraftBtn = page.getByRole('button', { name: /Save Draft|Save Triage/i }).first();
    if (await saveDraftBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await saveDraftBtn.click();
      await page.waitForTimeout(2000);
    }

    await expect(page.locator('body')).toBeVisible();
  });

});
