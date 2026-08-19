import { Page, Locator } from '@playwright/test';

export class BasePage {

  constructor(protected page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  async expectUrl(urlSubstring: string): Promise<void> {
    await this.page.waitForURL((url) => url.href.includes(urlSubstring));
  }

  async expectVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }
}
