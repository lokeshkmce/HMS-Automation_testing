import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  // Dynamic getters for fresh locator evaluation
  get patientLoginBtn(): Locator {
    return this.page.getByRole('button', { name: 'Patient Login' }).or(this.page.getByText('Patient Login')).first();
  }

  get staffLoginBtn(): Locator {
    return this.page.getByRole('button', { name: 'Staff Login' }).or(this.page.getByText('Staff Login')).first();
  }

  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email address' });
  }

  get continueOtpBtn(): Locator {
    return this.page.getByRole('button', { name: 'Continue with OTP' });
  }

  get otpInput(): Locator {
    return this.page.getByRole('textbox', { name: '••••••' });
  }

  get verifyCodeBtn(): Locator {
    return this.page.getByRole('button', { name: 'Verify Code' });
  }

  get usernameInput(): Locator {
    return this.page.getByRole('textbox', { name: /Username|Email/i }).or(this.page.locator('input[name="username"]')).first();
  }

  get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: /Password/i }).or(this.page.locator('input[name="password"]')).first();
  }

  async gotoHomePage(): Promise<void> {
    await this.navigate('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginAsPatient(email: string = 'flowcheck@gmail.com', otp: string = '0000'): Promise<void> {
    await this.gotoHomePage();
    await this.click(this.patientLoginBtn);
    await this.fill(this.emailInput, email);
    await this.click(this.continueOtpBtn);
    
    await this.otpInput.waitFor({ state: 'visible', timeout: 10_000 });
    await this.fill(this.otpInput, otp);
    await this.click(this.verifyCodeBtn);
    await this.waitForPageLoad();
  }

  async loginAsStaff(username: string = 'qa.derma@omnivva.com', password: string = 'password123'): Promise<void> {
    await this.gotoHomePage();

    // 1. Click Staff Login button
    await this.staffLoginBtn.click({ force: true });

    // 2. Fill credentials on Keycloak Identity Server
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.fill(this.usernameInput, username);

    await this.passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.fill(this.passwordInput, password);
    await this.passwordInput.press('Enter');

    // 3. Wait for NextAuth redirect to /staff
    await this.page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await this.page.waitForTimeout(2000);
  }
}
