import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class PatientPortalPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get bookDoctorLink(): Locator {
    return this.page.getByRole('link', { name: /Book Doctor/i }).first();
  }

  get routineCheckupBtn(): Locator {
    return this.page.getByRole('button', { name: /Routine Checkup/i }).or(this.page.getByText(/Routine Checkup/i)).first();
  }

  get nextBtn(): Locator {
    return this.page.getByRole('button', { name: 'Next' });
  }

  get specialtySelect(): Locator {
    return this.page.getByText('Select Specialty');
  }

  get facilitySelect(): Locator {
    return this.page.getByText('Select Facility').first();
  }

  get symptomsInput(): Locator {
    return this.page.getByRole('textbox', { name: /Describe your symptoms/i });
  }

  get confirmPayBtn(): Locator {
    return this.page.getByRole('button', { name: 'Confirm & Pay' });
  }

  get upiOptionLabel(): Locator {
    return this.page.locator('label').filter({ hasText: /UPI \/ QR/i });
  }

  get upiIdInput(): Locator {
    return this.page.getByRole('textbox', { name: /upi|yourname/i }).or(this.page.locator('input[placeholder*="upi"]')).first();
  }

  get payNowBtn(): Locator {
    return this.page.getByRole('button', { name: /Pay Now/i }).first();
  }

  async startBookingFlow(): Promise<void> {
    await this.bookDoctorLink.waitFor({ state: 'visible', timeout: 15_000 });
    await this.click(this.bookDoctorLink);

    await this.routineCheckupBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await this.click(this.routineCheckupBtn);
    await this.click(this.nextBtn);
  }

  async selectSpecialtyAndFacility(specialty = 'Dermatology', facility = 'Omnivva Central Hospital'): Promise<void> {
    await this.click(this.specialtySelect);
    await this.page.getByRole('option', { name: specialty }).click();

    await this.click(this.facilitySelect);
    await this.page.getByRole('option', { name: facility }).click();
    await this.click(this.nextBtn);
  }

  async selectDoctor(doctorName = 'Dr. QA dermatology'): Promise<void> {
    const doctorCard = this.page.getByText(new RegExp(doctorName, 'i')).first();
    await doctorCard.waitFor({ state: 'visible', timeout: 15_000 });
    await doctorCard.click();
    await this.click(this.nextBtn);
  }

  async selectDateAndAvailableSlot(dateStr = '2026-08-12'): Promise<void> {
    await this.page.locator('input[type="date"]').fill(dateStr);

    const availableSlot = this.page.getByText(/\d+:\d+\s*(AM|PM)/i).first();
    await availableSlot.waitFor({ state: 'visible', timeout: 15_000 });
    await availableSlot.click();

    await expect(this.nextBtn).toBeEnabled({ timeout: 10_000 });
    await this.click(this.nextBtn);
  }

  async fillSymptomsAndProceed(symptoms = 'Fever and Routine Checkup'): Promise<void> {
    await this.fill(this.symptomsInput, symptoms);
    await this.click(this.nextBtn);
  }

  async completeUpiPayment(upiId = 'upi@upi'): Promise<void> {
    await this.click(this.confirmPayBtn);
    await this.click(this.upiOptionLabel);

    await this.upiIdInput.waitFor({ state: 'visible', timeout: 10_000 });
    await this.fill(this.upiIdInput, upiId);

    await expect(this.payNowBtn).toBeEnabled({ timeout: 10_000 });
    await this.click(this.payNowBtn);
    await this.page.waitForTimeout(3_000);
  }
}
