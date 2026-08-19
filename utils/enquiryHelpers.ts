import { type Page, type Locator } from '@playwright/test';

// ─── Shared modal locator ─────────────────────────────────────────────────────
export const getModal = (page: Page): Locator => page.locator('.MuiDialog-root').last();

// ─── MUI Dropdown / Select ───────────────────────────────────────────────────
export async function selectAnyOption(page: Page, labelText: string, optionText?: string | null) {
  if (!optionText) return;
  console.log(`Selecting option "${optionText}" for "${labelText}"`);
  const modal = getModal(page);

  // Open the dropdown
  try {
    const trigger = modal.locator('label').filter({ hasText: new RegExp(labelText, 'i') }).locator('xpath=..').first().locator('[role="combobox"], [role="button"], .MuiSelect-select').first();
    await trigger.click({ timeout: 3000, force: true });
  } catch {
    await modal.getByLabel(labelText, { exact: false }).first().click({ timeout: 3000, force: true }).catch(() => {});
  }

  await page.waitForTimeout(800);

  // Try multiple selection strategies
  try {
    const option = page.getByRole('option', { name: optionText }).last();
    const textOption = page.getByText(optionText, { exact: true }).last();

    try {
      await option.click({ timeout: 2000, force: true });
    } catch {
      try {
        await textOption.click({ timeout: 2000, force: true });
      } catch {
        // Fallback: Type and Enter
        await page.keyboard.type(optionText);
        await page.waitForTimeout(800);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      }
    }
  } catch (e) {
    console.log(`⚠  Failed selection for "${labelText}": ${optionText}`);
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForTimeout(800);
}

// ─── Text Input / Textarea ───────────────────────────────────────────────────
export async function fillAnyInput(page: Page, labelText: string, valueText?: string | null) {
  if (!valueText) return;
  const modal = getModal(page);

  // Strategy 1: Standard label-based fill
  try {
    await modal
      .getByLabel(labelText, { exact: false })
      .first()
      .fill(valueText, { timeout: 2000 });
    return;
  } catch {}

  // Strategy 2: Locate input/textarea via parent of label
  try {
    const input = modal
      .locator('label')
      .filter({ hasText: new RegExp(labelText, 'i') })
      .locator('xpath=..')
      .locator('input:not([type="hidden"]), textarea:not([aria-hidden="true"])')
      .first();
    await input.fill(valueText, { timeout: 2000, force: true });
    return;
  } catch {}

  // Strategy 3: Click the label to focus its field, then type via keyboard
  // Reliable for MUI textareas that are not directly accessible via label
  try {
    const labelEl = modal.getByText(labelText, { exact: false }).first();
    await labelEl.click({ force: true, timeout: 2000 });
    await page.waitForTimeout(200);
    // Clear any existing value first
    await page.keyboard.press('Control+a');
    await page.keyboard.type(valueText, { delay: 30 });
    return;
  } catch {}

  // Strategy 4: Tab through fields until we land on an empty textarea, then type
  try {
    const textareas = modal.locator('textarea:not([aria-hidden="true"])');
    const count = await textareas.count();
    for (let i = 0; i < count; i++) {
      const ta = textareas.nth(i);
      const placeholder = (await ta.getAttribute('placeholder') ?? '').toLowerCase();
      const ariaLabel   = (await ta.getAttribute('aria-label') ?? '').toLowerCase();
      if (placeholder.includes(labelText.toLowerCase()) || ariaLabel.includes(labelText.toLowerCase())) {
        await ta.click({ force: true, timeout: 1000 });
        await page.keyboard.press('Control+a');
        await page.keyboard.type(valueText, { delay: 30 });
        return;
      }
    }
  } catch {}

  console.log(`⚠  Could not fill "${labelText}"`);
}

// ─── File Upload ─────────────────────────────────────────────────────────────
export async function uploadDocument(page: Page, labelText: string, filePath?: string | null) {
  if (!filePath) return;
  const modal = getModal(page);
  try {
    const fileInput = modal
      .locator('div, label')
      .filter({ hasText: labelText })
      .locator('input[type="file"]')
      .first();
    await fileInput.setInputFiles(filePath, { timeout: 5000 });
  } catch {
    console.log(`⚠  Upload skipped for "${labelText}" — file input not found`);
  }
}

export async function nextAndWait(page: Page) {
  const nextBtn = page.getByRole('button', { name: 'Next' });
  try {
    await nextBtn.waitFor({ state: 'visible', timeout: 3000 });
    await nextBtn.click();
  } catch (e) {
    console.log("⚠ Next button not found or not clickable! We might be skipping or already on the last step.");
  }
  await page.waitForTimeout(2000);
}

export async function navigateToAddEnquiry(page: Page, urls?: any) {
  const targetUrl = urls?.enquiry || `${process.env.BASE_URL || 'https://sit-educore.navacle.com'}/en/enquiries/new`;
  console.log(`Navigating to ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('Navigation took too long or failed, attempting to continue:', e.message));
  await page.waitForTimeout(3000);
  
  // Ensure clean state: close any existing modal
  if (await page.locator('.MuiDialog-root').isVisible()) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }

  await page
    .getByRole('button', { name: /Add Enquiry/i })
    .first()
    .click({ force: true, timeout: 15000 });
    
  await getModal(page).waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(2000);
}

export async function fillParentInfo(page: Page, data: any) {
  await selectAnyOption(page, 'Preferred Branch', data.preferredBranch);
  await fillAnyInput(page, 'Full Name', data.fullName);
  await fillAnyInput(page, 'Email', data.email);
  await fillAnyInput(page, 'Primary Phone', data.primaryPhone);
  await fillAnyInput(page, 'Alternate Phone', data.alternatePhone);
  await fillAnyInput(page, 'Occupation', data.occupation);
  await fillAnyInput(page, 'Company', data.company);
  await selectAnyOption(page, 'Annual Income', data.annualIncome);
  await fillAnyInput(page, 'Residential Address', data.residentialAddress);

  if (data.anySibling) {
    await getModal(page)
      .getByLabel('Any sibling', { exact: false })
      .first()
      .check()
      .catch(() => {});
  }
  await nextAndWait(page);
}

export async function fillStudentInfo(page: Page, data: any) {
  await fillAnyInput(page, 'Student Name', data.studentName);
  await fillAnyInput(page, 'Date of Birth', data.dob);
  await selectAnyOption(page, 'Current Class', data.currentClass);
  await selectAnyOption(page, 'Applying For', data.applyingFor);

  await fillAnyInput(page, 'Current School', data.currentSchool);
  await page.waitForTimeout(800);
  await page.getByRole('option').first().click({ timeout: 2000 }).catch(async () => {
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  });
  await page.waitForTimeout(500);

  await selectAnyOption(page, 'Board Preference', data.boardPreference);

  if (data.documents?.birthCertificate)
    await uploadDocument(page, 'Birth Certificate', data.documents.birthCertificate);
  if (data.documents?.aadharCard)
    await uploadDocument(page, 'Aadhar Card', data.documents.aadharCard);
  if (data.documents?.transferCertificate)
    await uploadDocument(page, 'Transfer Certificate', data.documents.transferCertificate);

  await page.waitForTimeout(2000);
  await nextAndWait(page);
}

export async function fillAdmissionIntent(page: Page, data: any) {
  await selectAnyOption(page, 'Decision Timeline', data.decisionTimeline);
  await page.waitForTimeout(2000);
}

export async function fillInterests(page: Page, interests: string[], notes: string) {
  const modal = getModal(page);
  await page.waitForTimeout(1000);

  // ── Interest Chips ─────────────────────────────────────────────────────────
  if (Array.isArray(interests) && interests.length > 0) {
    for (const interest of interests) {
      let selected = false;

      // Strategy 1: page.evaluate — direct JS DOM click, bypasses all Playwright checks
      selected = await page.evaluate((text: string) => {
        const selectors = [
          '.MuiChip-root',
          '.MuiChip-clickable',
          '[role="button"]',
          '[role="option"]',
          'button',
          'span',
        ];
        for (const sel of selectors) {
          const els = document.querySelectorAll(sel);
          for (const el of els) {
            const elText = (el as HTMLElement).innerText?.trim() || el.textContent?.trim() || '';
            if (elText.toLowerCase() === text.toLowerCase()) {
              (el as HTMLElement).click();
              return true;
            }
          }
        }
        return false;
      }, interest).catch(() => false);

      await page.waitForTimeout(400);

      // Strategy 2: Playwright locator with force click
      if (!selected) {
        try {
          await modal
            .locator('.MuiChip-root, [role="button"]')
            .filter({ hasText: interest })
            .first()
            .click({ force: true, timeout: 2000 });
          selected = true;
        } catch {}
        await page.waitForTimeout(400);
      }

      // Strategy 3: Tab + Space keyboard navigation
      if (!selected) {
        try {
          await modal.locator('.MuiChip-root, [role="button"]').first().focus({ timeout: 2000 });
          for (let i = 0; i < 40; i++) {
            const focusedText = await page.evaluate(() =>
              (document.activeElement as HTMLElement)?.innerText?.trim() || ''
            );
            if (focusedText.toLowerCase() === interest.toLowerCase()) {
              await page.keyboard.press('Space');
              selected = true;
              await page.waitForTimeout(300);
              break;
            }
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100);
          }
        } catch {}
      }

      if (!selected) console.log(`⚠  Could not select interest chip: ${interest}`);
    }
  }

  // ── Notes Textarea ─────────────────────────────────────────────────────────
  if (notes) {
    let filled = false;

    // Strategy 1: React-compatible setValue via nativeInputValueSetter
    filled = await page.evaluate((text: string) => {
      const textareas = Array.from(
        document.querySelectorAll<HTMLTextAreaElement>('textarea:not([aria-hidden="true"])')
      ).filter(t => !t.disabled && t.offsetParent !== null);

      if (textareas.length === 0) return false;

      const ta = textareas[0];
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(ta, text);
      } else {
        ta.value = text;
      }
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }, notes).catch(() => false);

    // Strategy 2: Click first visible textarea and keyboard type
    if (!filled) {
      try {
        const ta = modal.locator('textarea:not([aria-hidden="true"])').first();
        await ta.scrollIntoViewIfNeeded();
        await ta.click({ force: true, timeout: 2000 });
        await page.keyboard.press('Control+a');
        await page.keyboard.type(notes, { delay: 25 });
        filled = true;
      } catch {}
    }

    // Strategy 3: Tab into textarea and type
    if (!filled) {
      try {
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(100);
          const tag = await page.evaluate(() => document.activeElement?.tagName || '');
          if (tag === 'TEXTAREA') {
            await page.keyboard.press('Control+a');
            await page.keyboard.type(notes, { delay: 25 });
            filled = true;
            break;
          }
        }
      } catch {}
    }

    if (!filled) console.log(`⚠  Could not fill notes textarea`);
  }

  await nextAndWait(page);
}

export async function fillTransport(page: Page, data: any) {
  if (data?.required) {
    try {
      await getModal(page)
        .locator('input[type="checkbox"]')
        .first()
        .check({ force: true, timeout: 3000 });
    } catch {
      console.log('⚠  Could not check Transport Required');
    }
  }
  await nextAndWait(page);
}

export async function fillSpecialNeeds(page: Page, data: any) {
  if (data) {
    await selectAnyOption(page, 'Special Needs', data.specialNeeds);
    await selectAnyOption(page, 'Medical Conditions', data.medicalConditions);
    await selectAnyOption(page, 'Learning Difficulties', data.learningDifficulties);
  }
  await nextAndWait(page);
}

export async function fillAcademics(page: Page, data: any) {
  if (data) {
    await selectAnyOption(page, 'Previous Academic', data.previousAcademicBoard);
    await fillAnyInput(page, 'Achievements', data.achievements);
    await selectAnyOption(page, 'Month', data.result);
    await selectAnyOption(page, 'Result', data.result); 
  }
  await page.waitForTimeout(1000);
  await nextAndWait(page);
}

export async function fillCommunication(page: Page, data: any) {
  if (data) {
    await selectAnyOption(page, 'Preferred Contact Time', data.contactTime);
    await selectAnyOption(page, 'Preferred Communication Language', data.communicationLanguage);
    if (data.whatsappUpdates) {
      await getModal(page)
        .locator('label')
        .filter({ hasText: /WhatsApp/i })
        .locator('input[type="checkbox"]')
        .first()
        .check({ force: true })
        .catch(() => {});
    }
  }
  await nextAndWait(page);
}

export async function fillAdditionalInfo(page: Page, info: any) {
  if (!info) { await nextAndWait(page); return; }

  let filled = false;
  const modal = getModal(page);

  // Strategy 1: React nativeInputValueSetter via page.evaluate — targets the LAST textarea
  // (Additional Info is always the last textarea on its step)
  filled = await page.evaluate((text: string) => {
    const textareas = Array.from(
      document.querySelectorAll<HTMLTextAreaElement>('textarea:not([aria-hidden="true"])')
    ).filter(t => !t.disabled && t.offsetParent !== null);

    if (textareas.length === 0) return false;
    const ta = textareas[textareas.length - 1]; // last textarea = Additional Info
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    if (setter) { setter.call(ta, text); } else { ta.value = text; }
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, info).catch(() => false);

  // Strategy 2: Standard fillAnyInput
  if (!filled) {
    await fillAnyInput(page, 'Additional information', info);
    filled = true;
  }
  

  // Strategy 3: Click last visible textarea and keyboard type
  if (!filled) {
    try {
      const textareas = modal.locator('textarea:not([aria-hidden="true"])');
      const count = await textareas.count();
      if (count > 0) {
        const ta = textareas.nth(count - 1);
        await ta.scrollIntoViewIfNeeded();
        await ta.click({ force: true, timeout: 2000 });
        await page.keyboard.press('Control+a');
        await page.keyboard.type(info, { delay: 25 });
      }
    } catch { console.log(`⚠  Could not fill Additional information`); }
  }

  await nextAndWait(page);
}

export async function reviewAndSubmit(page: Page) {
  console.log('Finalizing Enquiry Submission...');
  
  // Wait for the modal to be stable
  await page.waitForTimeout(2000);
  
  const saveBtn = page.getByRole('button', { name: 'Save Enquiry' }).last();
  
  // Wait for the button to be attached with a longer timeout
  try {
    await saveBtn.waitFor({ state: 'attached', timeout: 30000 });
  } catch (e) {
    console.log('⚠ Save Enquiry button not found in 30s. Check if wizard reached the last step.');
    // Try one last Tab/Space sequence just in case it's there but invisible to Playwright
  }

  // Robust keyboard navigation to the Save button
  for (let i = 0; i < 10; i++) {
    try {
      await saveBtn.focus({ timeout: 1000 });
      console.log('Successfully focused Save Enquiry button');
      break;
    } catch {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
    }
  }
  
  await page.waitForTimeout(500);
  await page.keyboard.press('Space');
  console.log('Pressed Space on Save Enquiry button');

  await Promise.race([
    page.getByText('successfully', { exact: false }).waitFor({ state: 'visible', timeout: 15000 }),
    page.getByText('created', { exact: false }).waitFor({ state: 'visible', timeout: 15000 }),
    getModal(page).waitFor({ state: 'hidden', timeout: 15000 }),
  ]).catch(() => console.log('Final confirmation message not seen, but Space was pressed.'));
}
