# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flow-check-specialties\dental\03-doctor-consultation.spec.ts >> Step 3: Doctor Consultation & Prescription - Dental >> TC_DOC_DENTAL [VALID]: Doctor Consultation for Dental
- Location: tests\e2e\flow-check-specialties\dental\03-doctor-consultation.spec.ts:11:7

# Error details

```
Error: locator.click: Element is outside of the viewport
Call log:
  - waiting for getByRole('button', { name: 'Doctor' }).or(getByText('Doctor', { exact: true })).or(locator('div, button, a').filter({ hasText: /^Doctor$/i })).first()
    - locator resolved to <button>…</button>
  - attempting click action
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e3]:
    - complementary [ref=f2e4]:
      - generic [ref=f2e6]:
        - img "Logo" [ref=f2e7]
        - generic [ref=f2e8]: MedCare Alliance
    - generic [ref=f2e11]:
      - banner [ref=f2e12]:
        - generic [ref=f2e13]:
          - button [ref=f2e14] [cursor=pointer]
          - generic [ref=f2e16]:
            - generic [ref=f2e17]: Workspace
            - generic [ref=f2e18]: /
            - generic [ref=f2e19]: Dashboard
        - generic [ref=f2e20]:
          - button "Notifications" [ref=f2e22] [cursor=pointer]
          - button [ref=f2e26] [cursor=pointer]
          - button "Switch application" [ref=f2e31] [cursor=pointer]
          - button "QA Dental STAFF QD" [ref=f2e39] [cursor=pointer]:
            - generic:
              - paragraph: QA Dental
              - paragraph: STAFF
            - generic: QD
      - main [ref=f2e42]:
        - generic [ref=f2e44]:
          - generic [ref=f2e45]:
            - navigation [ref=f2e46]:
              - list [ref=f2e47]:
                - listitem [ref=f2e48]:
                  - link "Home" [ref=f2e49] [cursor=pointer]:
                    - /url: /dashboard
                - listitem [ref=f2e50]
                - listitem [ref=f2e53]:
                  - paragraph [ref=f2e54]: Dashboard
            - generic [ref=f2e57]:
              - heading "Dashboard" [level=5] [ref=f2e58]
              - paragraph [ref=f2e59]: Welcome back! Here is an overview of your hospital today.
          - generic [ref=f2e60]:
            - generic [ref=f2e62]:
              - paragraph [ref=f2e67]: New Patients
              - paragraph [ref=f2e68]: "0"
            - generic [ref=f2e70]:
              - paragraph [ref=f2e75]: Today's Appointments
              - paragraph [ref=f2e76]: "3"
            - generic [ref=f2e78]:
              - paragraph [ref=f2e83]: Current Admissions
              - paragraph [ref=f2e84]: "0"
            - generic [ref=f2e86]:
              - paragraph [ref=f2e91]: Revenue Today
              - paragraph [ref=f2e92]: ₹0.0K
            - generic [ref=f2e94]:
              - paragraph [ref=f2e99]: Pending Lab Orders
              - paragraph [ref=f2e100]: "0"
            - generic [ref=f2e102]:
              - paragraph [ref=f2e107]: Pending Dispensing
              - paragraph [ref=f2e108]: "0"
          - generic [ref=f2e109]:
            - generic [ref=f2e111]:
              - generic [ref=f2e112]: Revenue Overview
              - generic [ref=f2e117]:
                - img [ref=f2e118]:
                  - generic [ref=f2e123]:
                    - generic [ref=f2e124]: 2026-07-20
                    - generic [ref=f2e126]: 2026-07-23
                    - generic [ref=f2e128]: 2026-07-26
                    - generic [ref=f2e130]: 2026-07-29
                    - generic [ref=f2e132]: 2026-08-01
                    - generic [ref=f2e134]: 2026-08-04
                    - generic [ref=f2e136]: 2026-08-07
                    - generic [ref=f2e138]: 2026-08-10
                    - generic [ref=f2e140]: 2026-08-13
                    - generic [ref=f2e142]: 2026-08-16
                    - generic [ref=f2e144]: 2026-08-19
                  - generic [ref=f2e147]:
                    - generic [ref=f2e148]: "0"
                    - generic [ref=f2e150]: "3000"
                    - generic [ref=f2e152]: "6000"
                    - generic [ref=f2e154]: "9000"
                    - generic [ref=f2e156]: "12000"
                - list [ref=f2e173]:
                  - listitem [ref=f2e174]: Consultation
                  - listitem [ref=f2e177]: Pharmacy
                  - listitem [ref=f2e180]: Laboratory
                  - listitem [ref=f2e183]: IPD
                  - listitem [ref=f2e186]: Other
                  - listitem [ref=f2e189]: Total
            - generic [ref=f2e192]: Bed Occupancy
          - generic [ref=f2e203]:
            - generic [ref=f2e204]: Admissions & Discharges
            - list [ref=f2e215]:
              - listitem [ref=f2e216]: Admissions
              - listitem [ref=f2e219]: Discharges
    - generic [ref=f2e222]:
      - generic [ref=f2e223]:
        - generic [ref=f2e224]:
          - heading "Select Role" [level=3] [ref=f2e225]
          - paragraph [ref=f2e226]: "Active:"
        - button "Close role switcher" [ref=f2e227] [cursor=pointer]
      - generic [ref=f2e231]:
        - button "Doctor" [ref=f2e232] [cursor=pointer]
        - button "Receptionist" [ref=f2e239] [cursor=pointer]
      - generic [ref=f2e246]: A simple click to select. A selection hides this panel.
    - button "Role Slider" [ref=f2e247] [cursor=pointer]
  - alert [ref=f2e252]
  - generic [ref=f2e253]: 2026-07-23
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import testData from '../../../../test-data/hmsTestData.json';
  3   | 
  4   | test.describe('Step 3: Doctor Consultation & Prescription - Dental', () => {
  5   | 
  6   |   test.beforeEach(async ({ page, context }) => {
  7   |     test.setTimeout(120_000);
  8   |     await context.clearCookies().catch(() => {});
  9   |   });
  10  | 
  11  |   test('TC_DOC_DENTAL [VALID]: Doctor Consultation for Dental', async ({ page }) => {
  12  |     await page.goto('https://dev-hms.srivyn.in/', { waitUntil: 'domcontentloaded', timeout: 45_000 });
  13  | 
  14  |     const staffLoginBtnDoc = page.getByRole('button', { name: 'Staff Login' }).first();
  15  |     if (await staffLoginBtnDoc.isVisible({ timeout: 5000 }).catch(() => false)) {
  16  |       await staffLoginBtnDoc.click();
  17  |     }
  18  | 
  19  |     const docUserInput = page.getByRole('textbox', { name: /Username|Email/i }).first();
  20  |     await docUserInput.waitFor({ state: 'visible', timeout: 15_000 });
  21  | 
  22  |     const docPassInput = page.getByRole('textbox', { name: /Password/i }).first();
  23  |     const docSignInBtn = page.getByRole('button', { name: /Sign In|Submit/i }).first();
  24  | 
  25  |     const emailsToTry = Array.from(new Set([
  26  |       'qa.dental@omnivva.com',
  27  |       'qa.dental@omnivva.com'.replace('cardio.surgery', 'cardiosurgery'),
  28  |       'qa.dental@omnivva.com'.replace('cardiosurgery', 'cardio.surgery'),
  29  |       'qa.dental@omnivva.com'.replace('@ominvva.com', '@omnivva.com'),
  30  |       'qa.dental@omnivva.com'.replace('@omnivva.com', '@ominvva.com')
  31  |     ]));
  32  | 
  33  |     for (const email of emailsToTry) {
  34  |       await docUserInput.click();
  35  |       await docUserInput.fill(email);
  36  |       await docPassInput.click();
  37  |       await docPassInput.fill('password123');
  38  | 
  39  |       if (await docSignInBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  40  |         await docSignInBtn.click();
  41  |       } else {
  42  |         await docPassInput.press('Enter');
  43  |       }
  44  | 
  45  |       await page.waitForTimeout(2000);
  46  |       const isInvalidDoc = await page.getByText(/Invalid credentials/i).isVisible({ timeout: 2000 }).catch(() => false);
  47  |       if (!isInvalidDoc) {
  48  |         break;
  49  |       }
  50  |     }
  51  | 
  52  |     await page.waitForURL((url) => url.href.includes('/staff'), { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {});
  53  |     await page.waitForTimeout(2000);
  54  | 
  55  |     // CLICK RIGHT EDGE VERTICAL "ROLE SLIDER" DRAWER TAB
  56  |     const roleSliderBtnDoc = page.getByText(/ROLE SLIDER/i)
  57  |       .or(page.locator('button, div, span').filter({ hasText: /ROLE SLIDER/i }))
  58  |       .first();
  59  | 
  60  |     if (await roleSliderBtnDoc.isVisible({ timeout: 4000 }).catch(() => false)) {
  61  |       await roleSliderBtnDoc.click({ force: true }).catch(() => {});
  62  |       await page.waitForTimeout(1000);
  63  |     }
  64  | 
  65  |     const doctorRoleCard = page.getByRole('button', { name: 'Doctor' })
  66  |       .or(page.getByText('Doctor', { exact: true }))
  67  |       .or(page.locator('div, button, a').filter({ hasText: /^Doctor$/i }))
  68  |       .first();
  69  | 
  70  |     if (await doctorRoleCard.isVisible({ timeout: 5000 }).catch(() => false)) {
> 71  |       await doctorRoleCard.click({ force: true });
      |                            ^ Error: locator.click: Element is outside of the viewport
  72  |       await page.waitForTimeout(2000);
  73  |     }
  74  | 
  75  |     const doctorConsoleBtn = page.getByRole('button', { name: /Doctor Console/i })
  76  |       .or(page.getByRole('link', { name: /Doctor Console/i }))
  77  |       .or(page.getByText(/Doctor Console/i))
  78  |       .first();
  79  | 
  80  |     if (await doctorConsoleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  81  |       await doctorConsoleBtn.click({ force: true });
  82  |       await page.waitForTimeout(2000);
  83  |     }
  84  | 
  85  |     const flowCheckRow = page.locator('tr, [role="row"], .MuiPaper-root, .MuiCard-root')
  86  |       .filter({ hasText: /flow check/i })
  87  |       .first();
  88  | 
  89  |     if (await flowCheckRow.isVisible({ timeout: 5000 }).catch(() => false)) {
  90  |       const startConsultBtn = flowCheckRow.getByRole('button', { name: /Start Consult/i })
  91  |         .or(flowCheckRow.getByText(/Start Consult/i))
  92  |         .first();
  93  | 
  94  |       if (await startConsultBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
  95  |         await startConsultBtn.click({ force: true });
  96  |         await page.waitForTimeout(2000);
  97  |       }
  98  |     }
  99  | 
  100 |     const provisionalDiagnosisInput = page.getByRole('textbox', { name: /Provisional Diagnosis/i })
  101 |       .or(page.locator('input[placeholder*="Diagnosis"], textarea[placeholder*="Diagnosis"]'))
  102 |       .first();
  103 | 
  104 |     if (await provisionalDiagnosisInput.isVisible({ timeout: 5000 }).catch(() => false)) {
  105 |       await provisionalDiagnosisInput.fill('Diagnosis - Dental');
  106 |     }
  107 | 
  108 |     const writePrescriptionBtn = page.getByRole('button', { name: /Write Prescription/i }).first();
  109 |     if (await writePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
  110 |       await writePrescriptionBtn.click({ force: true });
  111 |       await page.waitForTimeout(1500);
  112 | 
  113 |       const addMedBtn = page.getByRole('button', { name: /Add Medicine/i }).first();
  114 |       if (await addMedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  115 |         await addMedBtn.click({ force: true });
  116 |         await page.waitForTimeout(500);
  117 |       }
  118 | 
  119 |       const medicineSearchInput = page.getByRole('textbox', { name: /Tab Aspirin|Medicine|Search/i })
  120 |         .or(page.locator('input[placeholder*="Aspirin"]'))
  121 |         .first();
  122 | 
  123 |       if (await medicineSearchInput.isVisible({ timeout: 4000 }).catch(() => false)) {
  124 |         await medicineSearchInput.fill('amoxicillin');
  125 |         await page.waitForTimeout(1000);
  126 |         let medOption = page.locator('div, li').filter({ hasText: new RegExp('Amoxicillin', 'i') }).first();
  127 | 
  128 |         if (!(await medOption.isVisible({ timeout: 2000 }).catch(() => false))) {
  129 |           await medicineSearchInput.fill('dolo');
  130 |           await page.waitForTimeout(1000);
  131 |           medOption = page.locator('div, li').filter({ hasText: /Dolo 650/i }).first();
  132 |         }
  133 | 
  134 |         if (await medOption.isVisible({ timeout: 3000 }).catch(() => false)) {
  135 |           await medOption.click({ force: true });
  136 |         }
  137 |       }
  138 | 
  139 |       const savePrescriptionBtn = page.getByRole('button', { name: /Verify & Save Prescription|Save Prescription/i }).first();
  140 |       if (await savePrescriptionBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
  141 |         await savePrescriptionBtn.click({ force: true });
  142 |         await page.waitForTimeout(2000);
  143 |       }
  144 |     }
  145 | 
  146 |     const completeConsultBtn = page.getByRole('button', { name: /Complete Consultation/i }).first();
  147 |     if (await completeConsultBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  148 |       await completeConsultBtn.click({ force: true });
  149 |       await page.waitForTimeout(2000);
  150 |     }
  151 | 
  152 |     await expect(page.locator('body')).toBeVisible();
  153 |   });
  154 | 
  155 | });
  156 | 
```