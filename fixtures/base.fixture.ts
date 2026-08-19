import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { NavbarComponent } from '../components/navbar.component';
import { ApiClient } from '../utils/api-client';

/**
 * Extended test fixtures that provide page objects and utilities
 * to every test automatically.
 */
type AppFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  navbar: NavbarComponent;
  apiClient: ApiClient;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },

  apiClient: async ({}, use) => {
    const client = await new ApiClient().init();
    await use(client);
    await client.dispose();
  },
});

export { expect } from '@playwright/test';
