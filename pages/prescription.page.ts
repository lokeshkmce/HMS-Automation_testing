import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export interface MedicineRowData {
  name: string;
  selectText?: string;
  dose?: string;
  morn?: string;
  aftn?: string;
  night?: string;
  duration?: string;
  when?: string;
}

export interface PrescriptionFormData {
  medicines?: MedicineRowData[];
  instructions?: string;
  followUp?: string;
}

export class PrescriptionPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get prescriptionHeading(): Locator {
    return this.page.locator('h1, h2, h3, h4, h5, h6, div').filter({ hasText: /Rx Medicines|Prescription/i }).first();
  }

  get addMedicineBtn(): Locator {
    return this.page.getByRole('button', { name: /\+ Add Medicine|Add Medicine/i })
      .or(this.page.getByText(/\+ Add Medicine/i))
      .first();
  }

  get instructionsTextarea(): Locator {
    return this.page.getByRole('textbox', { name: /Instructions|Advice/i })
      .or(this.page.locator('textarea[placeholder*="clinical advice"], textarea[placeholder*="instructions"], textarea[name*="instructions"]'))
      .first();
  }

  get followUpInput(): Locator {
    return this.page.getByRole('textbox', { name: /Follow-up|Follow up/i })
      .or(this.page.locator('input[placeholder*="Review after"], textarea[placeholder*="Review after"], input[name*="followUp"], input[name*="follow_up"]'))
      .first();
  }

  get verifyAndSaveBtn(): Locator {
    return this.page.getByRole('button', { name: /Verify & Save Prescription|Save Prescription/i })
      .or(this.page.locator('button:has-text("Verify & Save Prescription")'))
      .first();
  }

  /**
   * Fills a single medicine row by index (0-indexed)
   */
  async fillMedicineRow(index: number, data: MedicineRowData): Promise<void> {
    // 1. Medicine Name Input (Autocomplete)
    const medicineInputs = this.page.locator('input[placeholder*="Aspirin"], input[placeholder*="Medicine"], input[placeholder*="Search"]');
    const medInput = (await medicineInputs.count()) > index ? medicineInputs.nth(index) : medicineInputs.first();

    if (await medInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await medInput.click({ force: true });
      await medInput.fill(data.name);
      await this.page.waitForTimeout(1000);

      // Select matched medicine option from dropdown
      const targetText = data.selectText || data.name;
      const option = this.page.locator('li, [role="option"], .MuiAutocomplete-option, .MuiMenuItem-root, div')
        .filter({ hasText: new RegExp(targetText, 'i') })
        .first();

      if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
        await option.click({ force: true });
      } else {
        await this.page.keyboard.press('ArrowDown').catch(() => {});
        await this.page.keyboard.press('Enter').catch(() => {});
      }
      await this.page.waitForTimeout(500);
    }

    // 2. Dose Input
    if (data.dose) {
      const doseInputs = this.page.locator('input[placeholder*="75 mg"], input[placeholder*="dose"], input[name*="dose"]');
      if ((await doseInputs.count()) > index) {
        const doseInput = doseInputs.nth(index);
        if (await doseInput.isVisible().catch(() => false)) {
          await doseInput.click({ force: true });
          await doseInput.fill(data.dose);
        }
      }
    }

    // 3. Duration Input
    if (data.duration) {
      const durationInputs = this.page.locator('input[placeholder*="days"], input[placeholder*="duration"], input[name*="duration"], input[value*="days"]');
      if ((await durationInputs.count()) > index) {
        const durInput = durationInputs.nth(index);
        if (await durInput.isVisible().catch(() => false)) {
          await durInput.click({ force: true });
          await durInput.fill(data.duration);
        }
      }
    }

    // 4. When Dropdown (Before food / After food)
    if (data.when) {
      const whenCombos = this.page.locator('.MuiSelect-select, [role="combobox"]').filter({ hasText: /food|stomach/i });
      if ((await whenCombos.count()) > index) {
        const whenCombo = whenCombos.nth(index);
        if (await whenCombo.isVisible().catch(() => false)) {
          await whenCombo.click({ force: true }).catch(() => {});
          await this.page.waitForTimeout(400);
          const whenOpt = this.page.locator('[role="option"], .MuiMenuItem-root').filter({ hasText: new RegExp(data.when, 'i') }).first();
          if (await whenOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
            await whenOpt.click({ force: true });
          } else {
            await this.page.keyboard.press('Escape').catch(() => {});
          }
        }
      }
    }
  }

  /**
   * Adds a new medicine row and returns new row count
   */
  async clickAddMedicine(): Promise<number> {
    if (await this.addMedicineBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.addMedicineBtn.click({ force: true });
      await this.page.waitForTimeout(1000);
    }
    return await this.getMedicineRowCount();
  }

  /**
   * Counts current medicine input rows
   */
  async getMedicineRowCount(): Promise<number> {
    const inputs = this.page.locator('input[placeholder*="Aspirin"], input[placeholder*="Medicine"]');
    return await inputs.count();
  }

  /**
   * Deletes a medicine row by index
   */
  async deleteMedicineRow(index = 0): Promise<void> {
    const deleteButtons = this.page.locator('button[aria-label*="delete"], button[aria-label*="remove"], button:has(svg), .MuiIconButton-root')
      .filter({ has: this.page.locator('svg') })
      .or(this.page.getByText('✕'));

    if ((await deleteButtons.count()) > index) {
      await deleteButtons.nth(index).click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Fills instructions / advice
   */
  async fillInstructions(advice: string): Promise<void> {
    if (await this.instructionsTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.instructionsTextarea.click({ force: true });
      await this.instructionsTextarea.fill(advice);
    }
  }

  /**
   * Fills follow-up text
   */
  async fillFollowUp(followUpText: string): Promise<void> {
    if (await this.followUpInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.followUpInput.click({ force: true });
      await this.followUpInput.fill(followUpText);
    }
  }

  /**
   * Submits the prescription form
   */
  async submitPrescription(): Promise<void> {
    if (await this.verifyAndSaveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.verifyAndSaveBtn.click({ force: true });
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Complete Full Prescription Form
   */
  async completeFullPrescription(data: PrescriptionFormData): Promise<void> {
    if (data.medicines && data.medicines.length > 0) {
      for (let i = 0; i < data.medicines.length; i++) {
        if (i > 0) {
          await this.clickAddMedicine();
        }
        await this.fillMedicineRow(i, data.medicines[i]);
      }
    }

    if (data.instructions) {
      await this.fillInstructions(data.instructions);
    }

    if (data.followUp) {
      await this.fillFollowUp(data.followUp);
    }

    await this.submitPrescription();
  }
}
