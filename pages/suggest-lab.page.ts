import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class SuggestLabPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get modalHeading(): Locator {
    return this.page.locator('h1, h2, h3, h4, h5, h6, div').filter({ hasText: /SUGGEST LAB/i }).first();
  }

  get searchInput(): Locator {
    return this.page.locator('input[placeholder*="Search test"], input[placeholder*="panel"], input[placeholder*="ECG"]').first();
  }

  get closeBtn(): Locator {
    return this.page.getByRole('button', { name: 'close', exact: true })
      .or(this.page.locator('button[aria-label="close"], svg[data-testid="CloseIcon"]'))
      .first();
  }

  get cancelBtn(): Locator {
    return this.page.getByRole('button', { name: 'Cancel', exact: true }).first();
  }

  get suggestToPatientBtn(): Locator {
    return this.page.getByRole('button', { name: /Suggest to Patient/i }).first();
  }

  get selectionCountText(): Locator {
    return this.page.locator('text=/\\d+ test\\(s\\) selected/i').first();
  }

  /**
   * Clicks a category filter chip (e.g. "Hematology", "Biochemistry", "All")
   */
  async filterByCategory(categoryName: string): Promise<void> {
    const chip = this.page.locator('button, .MuiChip-root, div[role="button"]')
      .filter({ hasText: new RegExp(`^${categoryName}$`, 'i') })
      .first();

    if (await chip.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chip.click({ force: true });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Searches for a test name or panel in the search bar
   */
  async searchTest(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchInput.click({ force: true });
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(600);
  }

  /**
   * Clears the search bar
   */
  async clearSearch(): Promise<void> {
    if (await this.searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.searchInput.click({ force: true });
      await this.searchInput.fill('');
      await this.page.waitForTimeout(400);
    }
  }

  /**
   * Selects a test by exact/partial test name
   */
  async selectTest(testName: string): Promise<void> {
    const row = this.page.locator('tr, [role="row"], div')
      .filter({ hasText: new RegExp(testName, 'i') })
      .first();

    const checkbox = row.locator('input[type="checkbox"], .MuiCheckbox-root, span[class*="Checkbox"]').first();
    if (await checkbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await checkbox.click({ force: true });
    } else {
      await row.click({ force: true });
    }
    await this.page.waitForTimeout(500);
  }

  /**
   * Returns whether the Suggest to Patient button is disabled or enabled
   */
  async isSuggestButtonDisabled(): Promise<boolean> {
    if (await this.suggestToPatientBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const disabledAttr = await this.suggestToPatientBtn.getAttribute('disabled');
      const ariaDisabled = await this.suggestToPatientBtn.getAttribute('aria-disabled');
      const classAttr = (await this.suggestToPatientBtn.getAttribute('class')) || '';
      return disabledAttr !== null || ariaDisabled === 'true' || classAttr.includes('Mui-disabled');
    }
    return true;
  }

  /**
   * Submits the suggested lab test to the patient
   */
  async submitSuggestion(): Promise<void> {
    await this.suggestToPatientBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.suggestToPatientBtn.click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  /**
   * Cancels and closes the modal
   */
  async cancelModal(): Promise<void> {
    if (await this.cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.cancelBtn.click({ force: true });
    } else if (await this.closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.closeBtn.click({ force: true });
    }
    await this.page.waitForTimeout(1000);
  }
}
