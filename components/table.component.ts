import { Page, Locator } from '@playwright/test';

/**
 * Reusable component for OrangeHRM data tables.
 */
export class TableComponent {
  readonly root: Locator;
  readonly rows: Locator;
  readonly headers: Locator;

  constructor(
    private readonly page: Page,
    rootSelector = '.oxd-table',
  ) {
    this.root = page.locator(rootSelector);
    this.rows = this.root.locator('.oxd-table-body .oxd-table-row');
    this.headers = this.root.locator('.oxd-table-header .oxd-table-row .oxd-table-cell');
  }

  async getRowCount(): Promise<number> {
    return this.rows.count();
  }

  async getCellText(rowIndex: number, colIndex: number): Promise<string> {
    const cell = this.rows.nth(rowIndex).locator('.oxd-table-cell').nth(colIndex);
    return (await cell.textContent())?.trim() ?? '';
  }

  async getHeaderTexts(): Promise<string[]> {
    const count = await this.headers.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      texts.push(((await this.headers.nth(i).textContent()) ?? '').trim());
    }
    return texts;
  }
}
