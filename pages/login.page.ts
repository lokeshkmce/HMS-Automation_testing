import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  get patientLoginBtn(): Locator {
    return this.page.getByRole('button', { name: 'Patient Login' }).or(this.page.getByText('Patient Login')).first();
  }

  get staffLoginBtn(): Locator {
    return this.page.getByRole('button', { name: 'Staff Login' }).or(this.page.getByText('Staff Login')).first();
  }

  get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: /Email/i })
      .or(this.page.locator('input[type="email"], input[name*="email" i], input[placeholder*="email" i]'))
      .first();
  }

  get continueOtpBtn(): Locator {
    return this.page.getByRole('button', { name: /Continue.*OTP|Continue|Send OTP/i })
      .or(this.page.getByText(/Continue.*OTP/i))
      .first();
  }

  get otpInput(): Locator {
    return this.page.getByRole('textbox', { name: /••••••|OTP/i })
      .or(this.page.locator('input[placeholder*="•"], input[placeholder*="otp" i], input[type="password"], input[name*="otp" i]'))
      .first();
  }

  get verifyCodeBtn(): Locator {
    return this.page.getByRole('button', { name: /Verify.*Code|Verify|Submit/i })
      .or(this.page.getByText(/Verify.*Code/i))
      .first();
  }

  get usernameInput(): Locator {
    return this.page.getByRole('textbox', { name: /Username|Email/i })
      .or(this.page.locator('input[name="username"], input[placeholder*="Username"], input[placeholder*="Email"]'))
      .first();
  }

  get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: /Password/i })
      .or(this.page.locator('input[name="password"], input[type="password"]'))
      .first();
  }

  get signInBtn(): Locator {
    return this.page.getByRole('button', { name: /Sign In|Submit/i }).first();
  }

  async gotoHomePage(): Promise<void> {
    await this.navigate('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginAsPatient(email: string = 'flowcheck@gmail.com', otp: string = '0000'): Promise<void> {
    await this.gotoHomePage();

    if (this.page.url().includes('/patient') && !this.page.url().includes('/patient/login')) {
      return;
    }

    // 1. Click Patient Login with retry if email input not visible
    for (let attempt = 0; attempt < 3; attempt++) {
      if (await this.emailInput.isVisible({ timeout: 1500 }).catch(() => false)) {
        break;
      }
      if (await this.patientLoginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await this.patientLoginBtn.click({ force: true });
        await this.page.waitForTimeout(1000);
      }
    }

    await this.emailInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.emailInput.click({ force: true }).catch(() => {});
    await this.fill(this.emailInput, email);
    await this.click(this.continueOtpBtn);
    
    await this.otpInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.otpInput.click({ force: true }).catch(() => {});
    await this.fill(this.otpInput, otp);
    await this.click(this.verifyCodeBtn);
    
    await this.page.waitForURL((url) => url.href.includes('/patient'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
    await this.page.waitForTimeout(1500);
  }

  async loginAsStaff(username: string = 'qa.derma@omnivva.com', password: string = 'password123'): Promise<void> {
    await this.gotoHomePage();

    // 1. Click Staff Login button with retry if username is not visible
    if (!this.page.url().includes('/staff')) {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (await this.usernameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          break;
        }
        if (await this.staffLoginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await this.staffLoginBtn.click({ force: true });
          await this.page.waitForTimeout(1000);
        }
      }
    }

    // 2. Fill credentials on Keycloak Identity Server
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.fill(this.usernameInput, username);

    await this.passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.fill(this.passwordInput, password);

    if (await this.signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.signInBtn.click();
    } else {
      await this.passwordInput.press('Enter');
    }

    // 3. Fallback email retry if invalid
    await this.page.waitForTimeout(2000);
    const isInvalid = await this.page.getByText(/Invalid credentials/i).isVisible({ timeout: 2000 }).catch(() => false);
    if (isInvalid) {
      const altUsername = username.includes('@ominvva.com')
        ? username.replace('@ominvva.com', '@omnivva.com')
        : username.replace('@omnivva.com', '@ominvva.com');
      await this.usernameInput.click();
      await this.fill(this.usernameInput, altUsername);
      await this.passwordInput.click();
      await this.fill(this.passwordInput, password);
      if (await this.signInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.signInBtn.click();
      } else {
        await this.passwordInput.press('Enter');
      }
    }

    // 4. Wait for NextAuth redirect to /staff
    await this.page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
    await this.page.waitForTimeout(1500);
  }
}
