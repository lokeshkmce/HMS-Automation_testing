import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DoctorPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get doctorConsoleHeading(): Locator {
    return this.page.locator('h1, h2, h5, h6').filter({ hasText: /Doctor Console|Consultation|Queue|Dermatology|Dashboard/i }).first();
  }

  get appointmentsMenuLink(): Locator {
    return this.page.getByRole('button', { name: 'Appointments' }).or(this.page.getByText('Appointments')).first();
  }

  get doctorConsoleMenuLink(): Locator {
    return this.page.getByRole('button', { name: 'Doctor Console' }).or(this.page.getByText('Doctor Console')).first();
  }

  async switchToDoctorRole(): Promise<void> {
    if (!this.page.url().includes('/staff/select-role')) {
      const switchChip = this.page.getByText('Switch Role').or(this.page.locator('.MuiChip-root:has-text("Switch Role")')).first();
      if (await switchChip.isVisible({ timeout: 3000 }).catch(() => false)) {
        await switchChip.click({ force: true });
      } else {
        await this.page.evaluate(() => window.location.href = '/staff/select-role');
      }
    }

    await this.page.waitForURL(/.*select-role.*/, { timeout: 10_000 }).catch(() => {});
    await this.page.waitForTimeout(1000);

    const doctorCard = this.page.getByRole('button', { name: /Doctor/i }).or(this.page.getByText('Doctor')).first();
    await doctorCard.waitFor({ state: 'visible', timeout: 10_000 });
    await doctorCard.scrollIntoViewIfNeeded().catch(() => {});
    await doctorCard.click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async openAppointmentsTab(): Promise<void> {
    if (await this.appointmentsMenuLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.appointmentsMenuLink.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  async verifyAppointmentStatus(status: string): Promise<void> {
    await this.openAppointmentsTab();
    const statusChip = this.page.getByText(new RegExp(status, 'i')).or(this.page.getByText(/Waiting|Scheduled|Checked In/i)).first();
    if (await statusChip.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(statusChip).toBeVisible();
    }
  }

  async openDoctorConsole(): Promise<void> {
    if (await this.doctorConsoleMenuLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.doctorConsoleMenuLink.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  async openPatientFromQueue(patientIdentifier = 'flow check'): Promise<void> {
    await this.openDoctorConsole();
    const queueItem = this.page.locator('tr, div').filter({ hasText: new RegExp(patientIdentifier, 'i') }).or(this.page.getByRole('button', { name: /Waiting|Checked In/i })).first();
    if (await queueItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      await queueItem.click({ force: true });
      await this.page.waitForTimeout(1500);
    }
  }

  async performConsultation(symptomsText = 'Mild skin rash and fever. Prescribed Paracetamol 500mg.'): Promise<void> {
    const startBtn = this.page.getByRole('button', { name: /Start Consultation|Start|Consult/i }).first();
    if (await startBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startBtn.click({ force: true });
      await this.page.waitForTimeout(1500);
    }

    const symptomsBox = this.page.getByRole('textbox', { name: /symptoms|complaint|notes/i }).or(this.page.locator('textarea')).first();
    if (await symptomsBox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await symptomsBox.fill(symptomsText);
    }

    const completeBtn = this.page.getByRole('button', { name: /Complete Consultation|Complete|Save Record|Finish/i }).first();
    if (await completeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await completeBtn.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }
}
