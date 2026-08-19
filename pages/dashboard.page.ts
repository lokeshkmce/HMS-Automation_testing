import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // ─── Locators ───────────────────────────────────────────────
  readonly heading: Locator;
  readonly profileDropdown: Locator;
  readonly logoutButton: Locator;
  readonly sideMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator("//h6[text()='Dashboard']");
    this.profileDropdown = page.locator("//div[contains(@class, 'MuiAvatar-root')]");
    this.logoutButton = page.locator("//button[text()='Logout']");
    this.sideMenu = page.locator('nav.MuiList-root'); // Assuming the sidebar is a MuiList
  }

  // ─── Actions ────────────────────────────────────────────────
  async goto(): Promise<void> {
    await this.navigate('/en/counsellor/dashboard');
  }

  async logout(): Promise<void> {
    await this.click(this.profileDropdown);
    await this.click(this.logoutButton);
  }

  async getHeadingText(): Promise<string> {
    return this.getText(this.heading);
  }

  async navigateToMenuItem(menuText: string): Promise<void> {
    const menuItem = this.page.locator(`//span[text()='${menuText}']/parent::a`);
    await this.click(menuItem);
    await this.waitForPageLoad();
  }

  // ─── Assertions ─────────────────────────────────────────────
  async expectOnDashboard(): Promise<void> {
    await this.expectUrl('counsellor/dashboard');
    await this.expectVisible(this.heading);
  }
}
