import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ReceptionistPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get checkInScreenLink(): Locator {
    return this.page.getByRole('button', { name: /Check.*In/i }).or(this.page.getByText(/Check.*In/i)).first();
  }

  get checkInPatientBtn(): Locator {
    return this.page.getByRole('button', { name: 'Check In Patient' }).or(this.page.getByText('Check In Patient')).first();
  }

  get closeDialogBtn(): Locator {
    return this.page.getByRole('button', { name: 'close', exact: true }).or(this.page.locator('button[aria-label="close"]')).first();
  }

  async switchToReceptionistRole(): Promise<void> {
    if (!this.page.url().includes('/staff/select-role')) {
      const userProfilePill = this.page.getByRole('button', { name: /QA.*STAFF|QA.*Doctor|QD|Doctor|Receptionist/i }).first();
      if (await userProfilePill.isVisible({ timeout: 2000 }).catch(() => false)) {
        await userProfilePill.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
      }

      const switchRoleBtn = this.page.getByRole('button', { name: 'Switch Role' }).or(this.page.getByText('Switch Role')).first();
      if (await switchRoleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await switchRoleBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(1000);
      } else {
        await this.page.goto('https://dev-hms.srivyn.in/staff/select-role', { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
      }
    }

    const receptionistCard = this.page.getByRole('button', { name: 'Receptionist' })
      .or(this.page.getByText('Receptionist', { exact: true }))
      .or(this.page.locator('div, button, a').filter({ hasText: /^Receptionist$/i }))
      .first();

    if (await receptionistCard.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await receptionistCard.scrollIntoViewIfNeeded().catch(() => {});
      await receptionistCard.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(2000);
    }
  }

  async checkInPatient(doctorName = 'Dr. QA dermatology'): Promise<void> {
    // 1. Switch to Receptionist Role
    await this.switchToReceptionistRole();

    // 2. Click Check-In Screen in left sidebar
    const checkInMenu = this.page.getByRole('button', { name: /Check.*In/i }).or(this.page.getByText(/Check.*In/i)).first();
    await checkInMenu.waitFor({ state: 'visible', timeout: 10_000 });
    await checkInMenu.click({ force: true });
    await this.page.waitForTimeout(2000);

    // 3. Filter by Doctor dropdown (MUI Select)
    const doctorFilterSelect = this.page.getByRole('combobox').or(this.page.getByText('All Doctors')).first();
    if (await doctorFilterSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      await doctorFilterSelect.click({ force: true });
      await this.page.waitForTimeout(500);

      const doctorOption = this.page.getByRole('option', { name: new RegExp(doctorName, 'i') }).or(this.page.getByText(new RegExp(doctorName, 'i'))).first();
      if (await doctorOption.isVisible({ timeout: 5000 }).catch(() => false)) {
        await doctorOption.click({ force: true });
        await this.page.waitForTimeout(1000);
      }
    }

    // 4. Click Patient in Today's Queue
    const patientCard = this.page.locator('.MuiCard-root, tr, [role="row"]')
      .filter({ hasText: /flow check|SCHEDULED|Waiting|Pending/i })
      .or(this.page.getByText('flow check'))
      .first();

    if (await patientCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await patientCard.click({ force: true });
      await this.page.waitForTimeout(1000);
    }

    // 5. Scroll down page to reveal "Check In Patient" button
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);

    // 6. Click Check In Patient button
    const checkInBtn = this.page.getByRole('button', { name: 'Check In Patient' }).or(this.page.getByText('Check In Patient')).first();
    if (await checkInBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await checkInBtn.scrollIntoViewIfNeeded().catch(() => {});
      await checkInBtn.click({ force: true });
      await this.page.waitForTimeout(1500);
    }

    // 7. Close Modal Dialog if open
    const closeBtn = this.page.getByRole('button', { name: 'close', exact: true }).or(this.page.locator('button[aria-label="close"]')).first();
    if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeBtn.click({ force: true });
    }
    await this.page.waitForTimeout(2000);
  }
}
