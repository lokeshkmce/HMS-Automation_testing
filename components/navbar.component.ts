import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * Reusable component representing the top navigation bar.
 * Can be composed into any page that has a nav bar.
 */
export class NavbarComponent {
  readonly root: Locator;
  readonly searchInput: Locator;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.oxd-topbar-header');
    this.searchInput = page.locator('.oxd-main-menu-search input');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.locator('a:has-text("Logout")');
  }

  async searchMenu(query: string): Promise<void> {
    logger.info(`Searching menu for: ${query}`);
    await this.searchInput.fill(query);
  }

  async openUserMenu(): Promise<void> {
    await this.userDropdown.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutLink.click();
  }
}
